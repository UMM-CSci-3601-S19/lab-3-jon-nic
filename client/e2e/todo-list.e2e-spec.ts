import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';

let origFn = browser.driver.controlFlow().execute;

//https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  origFn.call(browser.driver.controlFlow(), function () {
    return protractor.promise.delayed(10);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('should get and highlight Todo Name attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('should type something in filter owner box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeAOwner("b");
    expect(page.getUniqueTodo("software design")).toEqual("Blanche");
    page.backspace();
    page.typeAOwner("Fry")
    expect(page.getUniqueTodo("video games")).toEqual("Fry");
  });

  it('should type something in filter body box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeABody('magna');

    expect(page.getUniqueTodo("video games")).toEqual("Fry");

    expect(page.getUniqueTodo("software design")).toEqual("Blanche");

  });

  it('should type something in all filter fields and check that it returns the correct element',() => {
    page.navigateTo();
    page.typeAOwner("bl");
    page.typeABody("Nostrud");
    page.typeACategory("homework");
    page.typeAStatus("true");

    expect(page.getUniqueTodo("homework")).toEqual("Blanche");
  })
});
