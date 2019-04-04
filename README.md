# react-slot-props

> slot slot slot , react slot!

### Usage

```jsx
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { createSlotComponents } from 'react-slot-props'

const Home = createSlotComponents(
  ({ slot }) => {
    return (
      <div>
        {slot.render('areas.header.areas.logo', render =>
          render({
            innerData: 'This is Logo,'
          })
        )}
        {slot.render('areas.header.areas.nav.elements',(render,props)=>{
          return props.title
        })}
        {slot.render('areas.body')}
      </div>
    )
  },
  [
    {
      type: 'Home',
      root: true,
      areas: ['Header', 'Body', 'Footer']
    },
    {
      type: 'Header',
      areas: ['Logo', 'Nav']
    },
    {
      type: 'Logo'
    },
    {
      type: 'Nav',
      elements: ['Element']
    },
    {
      type: 'Element'
    },
    {
      type: 'Body'
    }
  ]
)

const Wrapper = props => {
  const [visible, setState] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setState(false)
    }, 2000)
  })
  return visible ? props.children : <React.Fragment />
}

const NavItem = (props) => {
  const [title, setTitle] = useState(props.title)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setTitle('123123123123')
  //   }, 1000)
  // })
  return <Home.Element title={title} />
}

const App = () => {
  const [columns, setColumns] = useState([])
  useEffect(() => {
    setTimeout(() => {
      setColumns([1, 2, 3, 4])
    },1000)
  }, [])
  return (
    <Home>
      <Home.Header>
        <Home.Nav>
          {columns.map(key => {
            return <NavItem key={key} title={key} />
          })}
        </Home.Nav>
        <Home.Logo>{({ innerData }) => <div>{innerData}</div>}</Home.Logo>
      </Home.Header>
      <Wrapper>
        <Home.Body>{() => <div>This is Body</div>}</Home.Body>
      </Wrapper>
    </Home>
  )
}

ReactDOM.render(<App/>,document.getElementById('root'))
```

### API

**`createSlotComponents(RootComponent : Function,relations :Array<Relation>) : Function`**

```javascript
type Relations {
    type : String
    areas: Array<String>
    elements: Array<String>
    root : boolean
}
```

### Install

```
npm install --save react-slot-props
```

### LICENSE

The MIT License (MIT)

Copyright (c) 2018 JanryWang

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
