import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import {CustomModule} from '../custom.module';

import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
        {
          id: 'todd_id',
          owner: 'Todd',
          status: true,
          body: 'hello',
          category: 'software design'
        },
        {
          id: 'boriat_id',
          owner: 'Boriat',
          status: true,
          body: 'hi',
          category: 'homework'
        },
        {
          id: 'pete_id',
          owner: 'Pete',
          status: false,
          body: 'howdy',
          category: 'video games'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ UserListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]

    });

    beforeEach(async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('contains all the todos', () => {
      expect(todoList.todos.length).toBe(3);
    });

    it('contains a todo owner \'Todd\'', () => {
      expect(todoList.todos.some((todo: Todo) => todo.owner === 'Todd')).toBe(true);
    });

    it('contain a todo owner \'Boriat\'', () => {
      expect(todoList.todos.some((todo: Todo) => todo.owner === 'Boriat')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
      expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
    });

    it('has two todos that have status true ', () => {
      expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
    });

    it('todo list filters by owner', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoOwner = 'todd';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

    it('todo list filters by category', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoCategory = 'home';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

    it('todo list filters by body', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoBody = 'hi';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

    it('todo list filters by status', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoStatus = 'false';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

    it('todo list filters by status', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoStatus = 'true';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(2));
    });

    it('todo list filters by owner and category', () => {
      expect(todoList.filteredTodos.length).toBe(3);
      todoList.todoCategory = 'video games';
      todoList.todoOwner = 'pete';
      const a: Observable<Todo[]> = todoList.refreshTodos();
      a.do(x => Observable.of(x))
        .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });
  });
});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    expect(todoList.todos).toBeUndefined();
  });
});
