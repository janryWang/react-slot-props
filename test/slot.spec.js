import test from 'ava'
import './polyfill'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createSlotComponents } from '../src'

Enzyme.configure({ adapter: new Adapter() })

test('simple', t => {
  const Home = createSlotComponents(
    ({ slot }) => {
      return (
        <div>
          {slot.render('areas.header.areas.logo',(render)=>render({
            innerData:"This is Logo,"
          }))}
          {slot('areas.header.areas.nav.elements[0].props.title')}
          {slot.render('areas.header.areas.nav.elements')}
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
  const Comp = props=>props.children()
  const el = (
    <div>
    <Home>
      <Home.Header>
        <Home.Nav>
          <Home.Element title="hello world" />
          <Home.Element>{()=><div>123123123</div>}</Home.Element>
          <Home.Element>{()=><div>aaaa</div>}</Home.Element>
        </Home.Nav>
        <Home.Logo>
          {({innerData})=><div>{innerData}</div>}
        </Home.Logo>
      </Home.Header>
      <Home.Body>{() => <div>This is Body</div>}</Home.Body>
    </Home>
    </div>
  )
  t.truthy(mount(el).text() === 'This is Logo,hello world123123123aaaaThis is Body')
})
