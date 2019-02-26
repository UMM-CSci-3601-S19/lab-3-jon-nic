import {Component, OnInit} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  providers: []
})

export class TodoListComponent implements OnInit {
  public todos: Todo[];
  public filteredTodos: Todo[];

  public todoOwner: string;
  public todoStatus: string;
  public todoCategory: string;
  public todoBody: string;

  constructor(private todoListService: TodoListService) {

  }

  public filterTodos(searchOwner: string, searchStatus: string, searchCategory: string, searchBody: string): Todo[] {

    this.filteredTodos = this.todos;

    // Filter by Owner
    if (searchOwner != null) {
      searchOwner = searchOwner.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
      });
    }

    // Filter by Status
    if (searchStatus != null) {
      searchStatus = searchStatus.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter((todo: Todo) => {
        return !searchStatus || todo.status.toString().toLowerCase().indexOf(searchOwner) !== -1;
      });
    }

    // Filter by Category
    if(searchCategory != null){
      searchCategory = searchCategory.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
      })
    }

    // Filter by Body
    if (searchBody != null) {
      searchBody = searchBody.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
      });
    }

    return this.filteredTodos;
  }

  refreshTodos(): Observable<Todo[]> {

    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      returnedTodos => {
        this.todos = returnedTodos;
        this.filterTodos(this.todoOwner, this.todoStatus, this.todoCategory, this.todoBody);
      },
      err => {
        console.log(err);
      });
    return todos;
  }

  ngOnInit(): void {
    this.refreshTodos();
  }
}
