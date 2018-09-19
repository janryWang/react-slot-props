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
      return <div>{slot('areas.header.areas.nav.elements[0].props.title')}</div>
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
      }
    ]
  )
  const el = (
    <Home>
      <Home.Header>
        <Home.Nav>
          <Home.Element title="hello world" />
        </Home.Nav>
      </Home.Header>
    </Home>
  )
  t.truthy(mount(el).text() === 'hello world')
  t.truthy(mount(el).text() === 'hello world')
})
