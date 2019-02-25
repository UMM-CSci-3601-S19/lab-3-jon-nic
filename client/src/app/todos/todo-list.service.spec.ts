import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
  // A small collection of test users
  const testTodos: Todo[] = [
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
  ];
  let todoListService: TodoListService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    const req = httpTestingController.expectOne(todoListService.todoUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testTodos);
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo.id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });
});
