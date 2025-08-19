#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::Time,
        weights::Weight,
    };
    use frame_system::pallet_prelude::*;
    use sp_std::prelude::*;

    /// Configure the pallet by specifying the parameters and types on which it depends.
    #[pallet::config]
    pub trait Config: frame_system::Config {
        /// Because this pallet emits events, it depends on the runtime's definition of an event.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// The type used to represent timestamps in the runtime
        type Moment: Parameter + Default + Copy + MaxEncodedLen;
        
        /// The time provider
        type TimeProvider: Time<Moment = Self::Moment>;
        
        /// Maximum length of a todo title
        #[pallet::constant]
        type MaxTitleLength: Get<u32>;
        
        /// Maximum length of a todo description
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
        
        /// Maximum number of todos per account
        #[pallet::constant]
        type MaxTodosPerAccount: Get<u32>;
    }

    /// Priority level for a todo item
    #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    pub enum Priority {
        Low,
        Medium,
        High,
    }

    /// A todo item
    #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    #[scale_info(skip_type_params(T))]
    pub struct Todo<T: Config> {
        /// Unique identifier for the todo
        pub id: u64,
        /// Title of the todo
        pub title: BoundedVec<u8, T::MaxTitleLength>,
        /// Description of the todo
        pub description: BoundedVec<u8, T::MaxDescriptionLength>,
        /// Whether the todo is completed
        pub completed: bool,
        /// Priority level of the todo
        pub priority: Priority,
        /// When the todo was created
        pub created_at: T::Moment,
        /// When the todo was last updated
        pub updated_at: T::Moment,
        /// When the todo was completed (if completed)
        pub completed_at: Option<T::Moment>,
    }

    /// Todo statistics
    #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen, Default)]
    pub struct TodoStatistics {
        /// Total number of todos
        pub total: u32,
        /// Number of completed todos
        pub completed: u32,
        /// Number of pending todos
        pub pending: u32,
        /// Number of high priority todos
        pub high_priority: u32,
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    /// Storage for todos, keyed by account ID
    #[pallet::storage]
    #[pallet::getter(fn todos)]
    pub type Todos<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        BoundedVec<Todo<T>, T::MaxTodosPerAccount>,
        ValueQuery,
    >;

    /// Next ID for todos, keyed by account ID
    #[pallet::storage]
    #[pallet::getter(fn next_id)]
    pub type NextId<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        u64,
        ValueQuery,
    >;

    /// Todo statistics, keyed by account ID
    #[pallet::storage]
    #[pallet::getter(fn todo_stats)]
    pub type TodoStats<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        TodoStatistics,
        ValueQuery,
    >;

    // Pallets use events to inform users when important changes are made.
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// A todo was created
        TodoCreated { who: T::AccountId, id: u64 },
        /// A todo was updated
        TodoUpdated { who: T::AccountId, id: u64 },
        /// A todo's completion status was toggled
        TodoCompletionToggled { who: T::AccountId, id: u64, completed: bool },
        /// A todo was deleted
        TodoDeleted { who: T::AccountId, id: u64 },
    }

    // Errors inform users that something went wrong.
    #[pallet::error]
    pub enum Error<T> {
        /// The todo list is full
        TodoListFull,
        /// The todo title is too long
        TitleTooLong,
        /// The todo description is too long
        DescriptionTooLong,
        /// The todo was not found
        TodoNotFound,
    }

    // Dispatchable functions allows users to interact with the pallet and invoke state changes.
    // These functions materialize as "extrinsics", which are often compared to transactions.
    // Dispatchable functions must be annotated with a weight and must return a DispatchResult.
    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Create a new todo
        #[pallet::call_index(0)]
        #[pallet::weight(Weight::from_parts(10_000, 0).saturating_add(T::DbWeight::get().writes(1)))]
        pub fn create_todo(
            origin: OriginFor<T>,
            title: Vec<u8>,
            description: Vec<u8>,
            priority: Priority,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Check title length
            let title = BoundedVec::<u8, T::MaxTitleLength>::try_from(title)
                .map_err(|_| Error::<T>::TitleTooLong)?;
            
            // Check description length
            let description = BoundedVec::<u8, T::MaxDescriptionLength>::try_from(description)
                .map_err(|_| Error::<T>::DescriptionTooLong)?;
            
            // Get current time
            let now = T::TimeProvider::now();
            
            // Get next ID
            let id = Self::next_id(&who);
            
            // Create new todo
            let todo = Todo {
                id,
                title,
                description,
                completed: false,
                priority,
                created_at: now,
                updated_at: now,
                completed_at: None,
            };
            
            // Add todo to storage
            Todos::<T>::try_mutate(&who, |todos| {
                todos.try_push(todo).map_err(|_| Error::<T>::TodoListFull)
            })?;
            
            // Increment next ID
            NextId::<T>::insert(&who, id + 1);
            
            // Update statistics
            Self::update_stats(&who);
            
            // Emit event
            Self::deposit_event(Event::TodoCreated { who, id });
            
            Ok(())
        }
        
        /// Update a todo
        #[pallet::call_index(1)]
        #[pallet::weight(Weight::from_parts(10_000, 0).saturating_add(T::DbWeight::get().writes(1)))]
        pub fn update_todo(
            origin: OriginFor<T>,
            id: u64,
            title: Option<Vec<u8>>,
            description: Option<Vec<u8>>,
            priority: Option<Priority>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Get current time
            let now = T::TimeProvider::now();
            
            // Update todo
            Todos::<T>::try_mutate(&who, |todos| -> DispatchResult {
                let todo = todos.iter_mut().find(|t| t.id == id).ok_or(Error::<T>::TodoNotFound)?;
                
                // Update title if provided
                if let Some(new_title) = title {
                    let new_title = BoundedVec::<u8, T::MaxTitleLength>::try_from(new_title)
                        .map_err(|_| Error::<T>::TitleTooLong)?;
                    todo.title = new_title;
                }
                
                // Update description if provided
                if let Some(new_description) = description {
                    let new_description = BoundedVec::<u8, T::MaxDescriptionLength>::try_from(new_description)
                        .map_err(|_| Error::<T>::DescriptionTooLong)?;
                    todo.description = new_description;
                }
                
                // Update priority if provided
                if let Some(new_priority) = priority {
                    todo.priority = new_priority;
                }
                
                // Update timestamp
                todo.updated_at = now;
                
                Ok(())
            })?;
            
            // Update statistics
            Self::update_stats(&who);
            
            // Emit event
            Self::deposit_event(Event::TodoUpdated { who, id });
            
            Ok(())
        }
        
        /// Toggle the completion status of a todo
        #[pallet::call_index(2)]
        #[pallet::weight(Weight::from_parts(10_000, 0).saturating_add(T::DbWeight::get().writes(1)))]
        pub fn toggle_todo_completion(
            origin: OriginFor<T>,
            id: u64,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Get current time
            let now = T::TimeProvider::now();
            
            // Toggle completion status
            let mut completed = false;
            Todos::<T>::try_mutate(&who, |todos| -> DispatchResult {
                let todo = todos.iter_mut().find(|t| t.id == id).ok_or(Error::<T>::TodoNotFound)?;
                
                // Toggle completion status
                todo.completed = !todo.completed;
                completed = todo.completed;
                
                // Update timestamps
                todo.updated_at = now;
                if todo.completed {
                    todo.completed_at = Some(now);
                } else {
                    todo.completed_at = None;
                }
                
                Ok(())
            })?;
            
            // Update statistics
            Self::update_stats(&who);
            
            // Emit event
            Self::deposit_event(Event::TodoCompletionToggled { who, id, completed });
            
            Ok(())
        }
        
        /// Delete a todo
        #[pallet::call_index(3)]
        #[pallet::weight(Weight::from_parts(10_000, 0).saturating_add(T::DbWeight::get().writes(1)))]
        pub fn delete_todo(
            origin: OriginFor<T>,
            id: u64,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Delete todo
            Todos::<T>::try_mutate(&who, |todos| -> DispatchResult {
                let index = todos.iter().position(|t| t.id == id).ok_or(Error::<T>::TodoNotFound)?;
                todos.remove(index);
                Ok(())
            })?;
            
            // Update statistics
            Self::update_stats(&who);
            
            // Emit event
            Self::deposit_event(Event::TodoDeleted { who, id });
            
            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        /// Update todo statistics for an account
        fn update_stats(who: &T::AccountId) {
            let todos = Self::todos(who);
            
            let total = todos.len() as u32;
            let completed = todos.iter().filter(|t| t.completed).count() as u32;
            let pending = total - completed;
            let high_priority = todos.iter()
                .filter(|t| matches!(t.priority, Priority::High) && !t.completed)
                .count() as u32;
            
            let stats = TodoStatistics {
                total,
                completed,
                pending,
                high_priority,
            };
            
            TodoStats::<T>::insert(who, stats);
        }
    }
}