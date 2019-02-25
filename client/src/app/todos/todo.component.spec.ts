import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
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
      ].find(todo => todo.id === todoId))
    };

    TestBed.configureTestingModule({
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve Todd by ID', () => {
    todoComponent.setId('todd_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.owner).toBe('Todd');
    expect(todoComponent.todo.category).toBe('software design');
    expect(todoComponent.todo.status).toEqual(true);
    expect(todoComponent.todo.body).toBe('hello');
  });

  it('returns undefined for Santa', () => {
    todoComponent.setId('Santa');
    expect(todoComponent.todo).not.toBeDefined();
  });

});
