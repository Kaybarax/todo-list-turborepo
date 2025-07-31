use crate::{mock::*, Error, Event, Priority, Todo};
use frame_support::{assert_noop, assert_ok};
use sp_runtime::traits::BlakeTwo256;

// Helper function to create a todo
fn create_test_todo(account: u64, title: &[u8], description: &[u8], priority: Priority) {
    assert_ok!(TodoPallet::create_todo(
        RuntimeOrigin::signed(account),
        title.to_vec(),
        description.to_vec(),
        priority
    ));
}

#[test]
fn create_todo_works() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo";
        let description = b"This is a test todo";
        let priority = Priority::Medium;

        // Create a todo
        create_test_todo(account, title, description, priority);

        // Check that the todo was created
        let todos = TodoPallet::todos(account);
        assert_eq!(todos.len(), 1);
        
        let todo = &todos[0];
        assert_eq!(todo.id, 0);
        assert_eq!(todo.title.as_slice(), title);
        assert_eq!(todo.description.as_slice(), description);
        assert_eq!(todo.priority, priority);
        assert_eq!(todo.completed, false);
        assert_eq!(todo.created_at, 1000);
        assert_eq!(todo.updated_at, 1000);
        assert_eq!(todo.completed_at, None);

        // Check that the next ID was incremented
        assert_eq!(TodoPallet::next_id(account), 1);

        // Check that the stats were updated
        let stats = TodoPallet::todo_stats(account);
        assert_eq!(stats.total, 1);
        assert_eq!(stats.completed, 0);
        assert_eq!(stats.pending, 1);
        assert_eq!(stats.high_priority, 0);

        // Check that the event was emitted
        System::assert_has_event(Event::TodoCreated { who: account, id: 0 }.into());
    });
}

#[test]
fn create_todo_fails_with_title_too_long() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = vec![b'a'; 101]; // 101 characters, max is 100
        let description = b"This is a test todo".to_vec();
        let priority = Priority::Medium;

        // Try to create a todo with a title that's too long
        assert_noop!(
            TodoPallet::create_todo(
                RuntimeOrigin::signed(account),
                title,
                description,
                priority
            ),
            Error::<Test>::TitleTooLong
        );
    });
}

#[test]
fn create_todo_fails_with_description_too_long() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo".to_vec();
        let description = vec![b'a'; 501]; // 501 characters, max is 500
        let priority = Priority::Medium;

        // Try to create a todo with a description that's too long
        assert_noop!(
            TodoPallet::create_todo(
                RuntimeOrigin::signed(account),
                title,
                description,
                priority
            ),
            Error::<Test>::DescriptionTooLong
        );
    });
}

#[test]
fn update_todo_works() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo";
        let description = b"This is a test todo";
        let priority = Priority::Medium;

        // Create a todo
        create_test_todo(account, title, description, priority);

        // Go to block 2 for a different timestamp
        System::set_block_number(2);

        // Update the todo
        let new_title = b"Updated Todo".to_vec();
        let new_description = b"This is an updated todo".to_vec();
        let new_priority = Priority::High;

        assert_ok!(TodoPallet::update_todo(
            RuntimeOrigin::signed(account),
            0,
            Some(new_title.clone()),
            Some(new_description.clone()),
            Some(new_priority.clone())
        ));

        // Check that the todo was updated
        let todos = TodoPallet::todos(account);
        let todo = &todos[0];
        assert_eq!(todo.title.as_slice(), new_title);
        assert_eq!(todo.description.as_slice(), new_description);
        assert_eq!(todo.priority, new_priority);
        assert_eq!(todo.updated_at, 2000);

        // Check that the stats were updated
        let stats = TodoPallet::todo_stats(account);
        assert_eq!(stats.high_priority, 1);

        // Check that the event was emitted
        System::assert_has_event(Event::TodoUpdated { who: account, id: 0 }.into());
    });
}

#[test]
fn update_todo_fails_with_nonexistent_id() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;

        // Try to update a todo that doesn't exist
        assert_noop!(
            TodoPallet::update_todo(
                RuntimeOrigin::signed(account),
                0,
                Some(b"Updated Todo".to_vec()),
                None,
                None
            ),
            Error::<Test>::TodoNotFound
        );
    });
}

#[test]
fn toggle_todo_completion_works() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo";
        let description = b"This is a test todo";
        let priority = Priority::Medium;

        // Create a todo
        create_test_todo(account, title, description, priority);

        // Go to block 2 for a different timestamp
        System::set_block_number(2);

        // Toggle completion
        assert_ok!(TodoPallet::toggle_todo_completion(
            RuntimeOrigin::signed(account),
            0
        ));

        // Check that the todo was updated
        let todos = TodoPallet::todos(account);
        let todo = &todos[0];
        assert_eq!(todo.completed, true);
        assert_eq!(todo.updated_at, 2000);
        assert_eq!(todo.completed_at, Some(2000));

        // Check that the stats were updated
        let stats = TodoPallet::todo_stats(account);
        assert_eq!(stats.completed, 1);
        assert_eq!(stats.pending, 0);

        // Check that the event was emitted
        System::assert_has_event(Event::TodoCompletionToggled { who: account, id: 0, completed: true }.into());

        // Go to block 3
        System::set_block_number(3);

        // Toggle completion again
        assert_ok!(TodoPallet::toggle_todo_completion(
            RuntimeOrigin::signed(account),
            0
        ));

        // Check that the todo was updated
        let todos = TodoPallet::todos(account);
        let todo = &todos[0];
        assert_eq!(todo.completed, false);
        assert_eq!(todo.updated_at, 3000);
        assert_eq!(todo.completed_at, None);

        // Check that the stats were updated
        let stats = TodoPallet::todo_stats(account);
        assert_eq!(stats.completed, 0);
        assert_eq!(stats.pending, 1);

        // Check that the event was emitted
        System::assert_has_event(Event::TodoCompletionToggled { who: account, id: 0, completed: false }.into());
    });
}

#[test]
fn toggle_todo_completion_fails_with_nonexistent_id() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;

        // Try to toggle completion of a todo that doesn't exist
        assert_noop!(
            TodoPallet::toggle_todo_completion(RuntimeOrigin::signed(account), 0),
            Error::<Test>::TodoNotFound
        );
    });
}

#[test]
fn delete_todo_works() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo";
        let description = b"This is a test todo";
        let priority = Priority::Medium;

        // Create a todo
        create_test_todo(account, title, description, priority);

        // Create another todo
        create_test_todo(account, b"Another Todo", b"This is another test todo", Priority::High);

        // Check that we have 2 todos
        assert_eq!(TodoPallet::todos(account).len(), 2);

        // Delete the first todo
        assert_ok!(TodoPallet::delete_todo(
            RuntimeOrigin::signed(account),
            0
        ));

        // Check that the todo was deleted
        let todos = TodoPallet::todos(account);
        assert_eq!(todos.len(), 1);
        assert_eq!(todos[0].id, 1);

        // Check that the stats were updated
        let stats = TodoPallet::todo_stats(account);
        assert_eq!(stats.total, 1);
        assert_eq!(stats.high_priority, 1);

        // Check that the event was emitted
        System::assert_has_event(Event::TodoDeleted { who: account, id: 0 }.into());
    });
}

#[test]
fn delete_todo_fails_with_nonexistent_id() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;

        // Try to delete a todo that doesn't exist
        assert_noop!(
            TodoPallet::delete_todo(RuntimeOrigin::signed(account), 0),
            Error::<Test>::TodoNotFound
        );
    });
}

#[test]
fn todo_list_full_error() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account = 1;
        let title = b"Test Todo";
        let description = b"This is a test todo";
        let priority = Priority::Medium;

        // Create the maximum number of todos (50)
        for _ in 0..50 {
            create_test_todo(account, title, description, priority);
        }

        // Try to create one more todo
        assert_noop!(
            TodoPallet::create_todo(
                RuntimeOrigin::signed(account),
                title.to_vec(),
                description.to_vec(),
                priority
            ),
            Error::<Test>::TodoListFull
        );
    });
}

#[test]
fn multiple_accounts_have_separate_todos() {
    new_test_ext().execute_with(|| {
        // Go to block 1 so we have a timestamp
        System::set_block_number(1);

        let account1 = 1;
        let account2 = 2;

        // Create a todo for account 1
        create_test_todo(account1, b"Account 1 Todo", b"This is a todo for account 1", Priority::Medium);

        // Create a todo for account 2
        create_test_todo(account2, b"Account 2 Todo", b"This is a todo for account 2", Priority::High);

        // Check that each account has its own todo
        let todos1 = TodoPallet::todos(account1);
        let todos2 = TodoPallet::todos(account2);

        assert_eq!(todos1.len(), 1);
        assert_eq!(todos2.len(), 1);

        assert_eq!(todos1[0].title.as_slice(), b"Account 1 Todo");
        assert_eq!(todos2[0].title.as_slice(), b"Account 2 Todo");

        // Check that each account has its own stats
        let stats1 = TodoPallet::todo_stats(account1);
        let stats2 = TodoPallet::todo_stats(account2);

        assert_eq!(stats1.total, 1);
        assert_eq!(stats2.total, 1);

        assert_eq!(stats1.high_priority, 0);
        assert_eq!(stats2.high_priority, 1);
    });
}