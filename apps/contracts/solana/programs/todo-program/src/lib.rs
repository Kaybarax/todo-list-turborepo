use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod todo_program {
    use super::*;

    /// Initialize a new todo list for a user
    pub fn initialize_todo_list(ctx: Context<InitializeTodoList>) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        todo_list.owner = ctx.accounts.owner.key();
        todo_list.todos = Vec::new();
        todo_list.next_id = 1;
        
        msg!("Todo list initialized for owner: {}", todo_list.owner);
        Ok(())
    }

    /// Create a new todo item
    pub fn create_todo(
        ctx: Context<CreateTodo>,
        title: String,
        description: String,
        priority: Priority,
    ) -> Result<()> {
        require!(title.len() <= 100, TodoError::TitleTooLong);
        require!(description.len() <= 500, TodoError::DescriptionTooLong);

        let todo_list = &mut ctx.accounts.todo_list;
        let clock = Clock::get()?;

        let new_todo = Todo {
            id: todo_list.next_id,
            title,
            description,
            completed: false,
            priority,
            created_at: clock.unix_timestamp,
            updated_at: clock.unix_timestamp,
            completed_at: None,
        };

        todo_list.todos.push(new_todo);
        todo_list.next_id += 1;

        msg!("Todo created with ID: {}", todo_list.next_id - 1);
        Ok(())
    }

    /// Update an existing todo item
    pub fn update_todo(
        ctx: Context<UpdateTodo>,
        todo_id: u64,
        title: Option<String>,
        description: Option<String>,
        priority: Option<Priority>,
    ) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        let clock = Clock::get()?;

        let todo = todo_list
            .todos
            .iter_mut()
            .find(|t| t.id == todo_id)
            .ok_or(TodoError::TodoNotFound)?;

        if let Some(new_title) = title {
            require!(new_title.len() <= 100, TodoError::TitleTooLong);
            todo.title = new_title;
        }

        if let Some(new_description) = description {
            require!(new_description.len() <= 500, TodoError::DescriptionTooLong);
            todo.description = new_description;
        }

        if let Some(new_priority) = priority {
            todo.priority = new_priority;
        }

        todo.updated_at = clock.unix_timestamp;

        msg!("Todo {} updated", todo_id);
        Ok(())
    }

    /// Toggle the completion status of a todo item
    pub fn toggle_todo_completion(ctx: Context<ToggleTodoCompletion>, todo_id: u64) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        let clock = Clock::get()?;

        let todo = todo_list
            .todos
            .iter_mut()
            .find(|t| t.id == todo_id)
            .ok_or(TodoError::TodoNotFound)?;

        todo.completed = !todo.completed;
        todo.updated_at = clock.unix_timestamp;

        if todo.completed {
            todo.completed_at = Some(clock.unix_timestamp);
            msg!("Todo {} marked as completed", todo_id);
        } else {
            todo.completed_at = None;
            msg!("Todo {} marked as incomplete", todo_id);
        }

        Ok(())
    }

    /// Delete a todo item
    pub fn delete_todo(ctx: Context<DeleteTodo>, todo_id: u64) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;

        let todo_index = todo_list
            .todos
            .iter()
            .position(|t| t.id == todo_id)
            .ok_or(TodoError::TodoNotFound)?;

        todo_list.todos.remove(todo_index);

        msg!("Todo {} deleted", todo_id);
        Ok(())
    }

    /// Get todo statistics
    pub fn get_todo_stats(ctx: Context<GetTodoStats>) -> Result<TodoStats> {
        let todo_list = &ctx.accounts.todo_list;

        let total = todo_list.todos.len() as u32;
        let completed = todo_list.todos.iter().filter(|t| t.completed).count() as u32;
        let pending = total - completed;

        let high_priority = todo_list
            .todos
            .iter()
            .filter(|t| matches!(t.priority, Priority::High) && !t.completed)
            .count() as u32;

        let stats = TodoStats {
            total,
            completed,
            pending,
            high_priority,
        };

        msg!("Todo stats - Total: {}, Completed: {}, Pending: {}, High Priority: {}", 
             stats.total, stats.completed, stats.pending, stats.high_priority);

        Ok(stats)
    }
}

#[derive(Accounts)]
pub struct InitializeTodoList<'info> {
    #[account(
        init,
        payer = owner,
        space = TodoList::SPACE,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump
    )]
    pub todo_list: Account<'info, TodoList>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateTodo<'info> {
    #[account(
        mut,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub todo_list: Account<'info, TodoList>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(
        mut,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub todo_list: Account<'info, TodoList>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ToggleTodoCompletion<'info> {
    #[account(
        mut,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub todo_list: Account<'info, TodoList>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTodo<'info> {
    #[account(
        mut,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub todo_list: Account<'info, TodoList>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetTodoStats<'info> {
    #[account(
        seeds = [b"todo_list", owner.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub todo_list: Account<'info, TodoList>,
    
    pub owner: Signer<'info>,
}

#[account]
pub struct TodoList {
    pub owner: Pubkey,
    pub todos: Vec<Todo>,
    pub next_id: u64,
}

impl TodoList {
    // Calculate space needed for the account
    // 8 (discriminator) + 32 (owner) + 4 (vec length) + (max_todos * todo_size) + 8 (next_id)
    pub const SPACE: usize = 8 + 32 + 4 + (50 * Todo::SPACE) + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Todo {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub completed: bool,
    pub priority: Priority,
    pub created_at: i64,
    pub updated_at: i64,
    pub completed_at: Option<i64>,
}

impl Todo {
    // Calculate space for a single todo item
    // 8 (id) + 4 + 100 (title) + 4 + 500 (description) + 1 (completed) + 1 (priority) + 8 (created_at) + 8 (updated_at) + 1 + 8 (completed_at)
    pub const SPACE: usize = 8 + 4 + 100 + 4 + 500 + 1 + 1 + 8 + 8 + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum Priority {
    Low,
    Medium,
    High,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TodoStats {
    pub total: u32,
    pub completed: u32,
    pub pending: u32,
    pub high_priority: u32,
}

#[error_code]
pub enum TodoError {
    #[msg("Todo not found")]
    TodoNotFound,
    #[msg("Title is too long (max 100 characters)")]
    TitleTooLong,
    #[msg("Description is too long (max 500 characters)")]
    DescriptionTooLong,
    #[msg("Maximum number of todos reached")]
    MaxTodosReached,
}