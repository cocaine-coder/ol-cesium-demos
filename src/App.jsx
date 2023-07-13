import { For, Switch, Match, createSignal } from 'solid-js'
import './App.css'
import demos from './demos'

function App() {
  const keys = Object.getOwnPropertyNames(demos);
  const [currentKey, setCurrentKey] = createSignal(keys[1]);

  return (
    <>
      <div className='router'>
        <For each={keys}>
          {
            (key) => (
              <div className={currentKey() === key ? 'router-item active' : 'router-item'}
                onClick={() => setCurrentKey(key)}>{key}</div>
            )
          }
        </For>
      </div>

      <Switch>
        <For each={keys}>
          {
            (key) => (
              <Match when={currentKey() === key}>
                {demos[key]}
              </Match>
            )
          }
        </For>
      </Switch>

      {/* <CreateMap></CreateMap> */}
    </>
  )
}

export default App
