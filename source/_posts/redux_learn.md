---
title: redux同步使用学习
date: 2017-09-18 00:23:02
tags: Web前端
---
# 传统mvc 模型
![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1506364035137&di=a0ecd7857196fff1b9bec39b12cf4e3d&imgtype=0&src=http%3A%2F%2Fwww.uml.org.cn%2Fzjjs%2Fimages%2F2016070733.jpg)

缺点：当一个view A(组件）会引起另外一些view B的变化的时候，状态逻辑比会比较散乱，比如 View B的model监听 VIEW A model 的变化

# Redux 模型
![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509558287821&di=a531d78dc6d05174bfaeb2f6ef8a4dac&imgtype=0&src=http%3A%2F%2Fimages2015.cnblogs.com%2Fblog%2F902276%2F201611%2F902276-20161110210030108-692932045.png)
# Action
* 行为的抽象
* 普通的JS 对象
* 必须有一个type
* 一般由方法生成

----------
```js
export const addTodo = (text) => ({
	    type: 'ADD_TODO',
	    id: nextTodoId++,
	    text
})
```
# Reducer

响应的抽象,只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。   (previousState, action) => newState
```js
import undoable from 'redux-undo'
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state
            }

            return {
                ...state,
                completed: !state.completed
            }
        default:
            return state
    }
}
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            )
        default:
            return state
    }
}

const undoableTodos = undoable(todos)
export default undoableTodos
```

## 合成reducer 讲多个reducer合并以方便传入
```js
import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

export default todoApp

```
# Store 
状态树, 状态的“数据库”，
Store 有以下职责：

- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器

----------
```js
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import todoApp from './reducers/index'

const store = createStore(todoApp)
```

# redux 数据流

1. store.dispatch(action)。
2. store 调用reducer函数响应
3. store 合并多个子reducer输出，合并成一个单一的state树
4. Redux store 保存了根 reducer 返回的完整 state 树

# container 与 component 区分
![](https://i.imgur.com/Ep9z9Sp.png)


## component: UI组件

不含有状态，UI 组件又称为"纯组件"，即它纯函数一样，纯粹由参数决定它的值

## container: 容器组建
- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API

connect 用于从UI组件生成容器组件

connect方法接受两个参数：mapStateToProps和mapDispatchToProps

- （1）输入逻辑：外部的数据（即state对象）如何转换为 UI 组件的参数
- （2）输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。


## mapStateToProps()
mapStateToProps是一个函数。它的作用就是像它的名字那样，建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系。

----------
```js
const mapStateToProps = (state) => ({
  todos: getVisibleTodos(state.todos.present, state.visibilityFilter)
})
```
connect方法可以省略mapStateToProps参数，那样的话，UI 组件就不会订阅Store，就是说 Store 的更新不会引起 UI 组件的更新。

----------

## mapDispatchToProps()
mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

# provider 组件
connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成 UI 组件的参数。
一种解决方法是将state对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将state传下去就很麻烦。React-Redux 提供Provider组件，可以让容器组件拿到state

----------
```js
	import { Provider } from 'react-redux'
	import { createStore } from 'redux'
	import todoApp from './reducers'
	import App from './components/App'
	let store = createStore(todoApp);
	
	render(
	  <Provider store={store}>
	    <App />
	  </Provider>,
	  document.getElementById('root')
	)
```
----------

# 实例

----------
```js
	import React, { Component } from 'react'
	import PropTypes from 'prop-types'
	import ReactDOM from 'react-dom'
	import { createStore } from 'redux'
	import { Provider, connect } from 'react-redux'
	
	// React component
	class Counter extends Component {
	  render() {
	    const { value, onIncreaseClick } = this.props
	    return (
	      <div>
	        <span>{value}</span>
	        <button onClick={onIncreaseClick}>Increase</button>
	      </div>
	    )
	  }
	}
	
	Counter.propTypes = {
	  value: PropTypes.number.isRequired,
	  onIncreaseClick: PropTypes.func.isRequired
	}
	
	// Action
	const increaseAction = { type: 'increase' }
	
	// Reducer
	function counter(state = { count: 0 }, action) {
	  const count = state.count
	  switch (action.type) {
	    case 'increase':
	      return { count: count + 1 }
	    default:
	      return state
	  }
	}
	
	// Store
	const store = createStore(counter)
	
	// Map Redux state to component props
	function mapStateToProps(state) {
	  return {
	    value: state.count
	  }
	}
	
	// Map Redux actions to component props
	function mapDispatchToProps(dispatch) {
	  return {
	    onIncreaseClick: () => dispatch(increaseAction)
	  }
	}
	
	// Connected Component
	const App = connect(
	  mapStateToProps,
	  mapDispatchToProps
	)(Counter)
	
	ReactDOM.render(
	  <Provider store={store}>
	    <App />
	  </Provider>,
	  document.getElementById('root')
	)
```