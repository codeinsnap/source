 
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import DeleteLine from '.'
 
const render = (component:any) => rtlRender(
  <Provider store={store}>
  {component}
  </Provider>
)
 
it('renders DeleteLine unchanged', () => {
  const { container } = render(<DeleteLine />)
  expect(container).toBeTruthy()
})
 