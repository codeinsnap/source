 
import { render as rtlRender} from '@testing-library/react'
import AddNewProductionLine from '.'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
 
const render = (component:any) => rtlRender(
  <Provider store={store}>
  {component}
  </Provider>
)
 
it('renders AddNewProductionLine unchanged', () => {
  const { container } = render(<AddNewProductionLine />)
  expect(container).toBeTruthy()
})
 