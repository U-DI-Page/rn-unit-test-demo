# RN 单测实战

目前主流测试框架有Jasmine、MOCHA、Jest。  
Jest 优点： 
* 零配置，开箱即用
* 隔离性好
* 优秀的api设计，简单实用
* IDE 整合
* 多项目运行
* 覆盖率  

Jest 常用命令：
* 初始化配置 `jest --init`  
* 指定目录 `jest --verbose ./src/slideChoose`

Matchers:
在使用 matchers 时要注意 toBe 是使用 Object.is 判断是否相等，如果是对象或者数组类型要用 toEqual。也可以反着测试 用 not.toBe 测试相反的结果。
```javascript
  test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
  });

  test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });

  test('two plus two is four', () => {
    expect(2 + 2).not.toBe(3);
  });
```
对于浮点型数据的断言，我们应该使用 toBeCloseTo 代替 toBe 或者 toEqual, 防止出现四舍五入后的报错。
```javascript
  test('test rount number', () => {
    const sum = 0.1 + 0.2;

    expect(sum).toBeCloseTo(0.3);
    // expect(sum).toBe(0.3);
  });
```
如果我们需要测试一个随机数的方法，可以通过判断区间范围去测试
```javascript
  test.only('test random number', () => {
    const randomNumber = Math.random() * 100;

    expect(randomNumber).toBeGreaterThan(0);
    expect(randomNumber).toBeLessThan(100);
  });
```
字符串用 toMatch 匹配，可以使用正则表达式
```javascript
  test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
  });
``` 


### Enzyme 工具使用
___
* shallow 只渲染当前组件，只能对当前组件做断言.可以对组件进行操作譬如find()、parents()、children()等选择器进行元素查找；state()、props()进行数据查找，setState()、setprops()操作数据；simulate()模拟事件触发
* mount 会渲染当前组件以及所有子组件，对所有子组件也可以做上述操作
* render 采用的是第三方库Cheerio渲染结果是普通的html结构，对于snapshot使用render比较合适，shallow和mount对组件的渲染结果不是html的dom树，而是react树
___
#### 三种方式对比，shallow 浅层渲染，不会触发 useEffect 或者生命周期函数 componentDidMount/componentDidUpdate, 但是可以触发constructor和render。 mount 都可以触发
____
## 情景 一

### 如何模拟测试外部组件库
```javascript
  import React, { useEffect } from 'react'
  import { Popup } from 'tuya-panel-kit';

  const Demo = () => {
    const handlePopup = () => {
        Popup.custom({
          content: (
            <View testID="content">
              <Text testID="content-text">content</Text>
            </View>
          ),
          onConfirm: () => {
            console.log('trigger confirm');
          },
        });
    }

    useEffect(() => {
      handlePopup();
    }, [])
    return null
  }
```
### 此时要测试弹窗后的 onConfirm 事件，就要先触发 useEffect , 所以选用 mount , 其次 `tuya-panel-kit` 属于外部组件库
需要用 jest.mock() 进行模拟, 可以自定义执行逻辑。
```javascript
  eg: // unit.test.js

  import React from 'react';
  import { mount } from 'enzyme';
  import UnitTest from '../index';

  jest.mock('tuya-panel-kit', () => {
    const RealModule = jest.requireActual('tuya-panel-kit');
    const mockModule = {
      ...RealModule,
      Popup: {
        ...RealModule.Popup,
        custom: ({ content, onConfirm }) => {
          onConfirm();
          return null;
        },
      },
    };
    return mockModule;
  });

  describe('Demo Test', () => {
    it('should render without issues', () => {
      const app = mount(<UnitTest />);
      expect(app.length).toBe(1);
      expect(app).toMatchSnapshot();
    });
  });
```

## 情景 二
### 如何测试 PanResponder 手势相关api

## 情景 三
### 如何测试

## 原理篇
### 如何实现测试块
测试块其实并不复杂，最简单的实现不过如下，我们需要把测试包装实际测试的回调函数存起来，所以封装一个 dispatch 方法接收命令类型和回调函数：
```javascript
  const test = (name, fn) => {
    dispatch({ type: "ADD_TEST", fn, name });
  };
```
我们需要在全局创建一个 state 保存测试的回调函数，测试的回调函数使用一个数组存起来
```javascript
  global["STATE_SYMBOL"] = {
    testBlock: [],
  };
```
dispatch 方法此时只需要甄别对应的命令，并把测试的回调函数存进全局的 state 即可
```javascript
  const dispatch = (event) => {
    const { fn, type, name } = event;
    switch (type) {
      case "ADD_TEST":
        const { testBlock } = global["STATE_SYMBOL"];
        testBlock.push({ fn, name });
        break;
    }
  };
```
### 如何实现断言和匹配器
断言库也实现也很简单，只需要封装一个函数暴露匹配器方法满足以下公式即可
```javascript
  expect(A).toBe(B);
```
这里我们实现 toBe 这个常用的方法，当结果和预期不相等，抛出错误即可
```javascript
  const expect = (actual) => ({
      toBe(expected) {
          if (actual !== expected) {
              throw new Error(`${actual} is not equal to ${expected}`);
          }
      }
  };
```
实际在测试块中会使用 try/catch 捕获错误，并打印堆栈信息方面定位问题。

在简单情况下，我们也可以使用 Node 自带的 assert 模块进行断言，当然还有很多更复杂的断言方法，本质上原理都差不多