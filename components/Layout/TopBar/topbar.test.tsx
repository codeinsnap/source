 
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import TopBar from './TopBar'
 
const render = (component:any) => rtlRender(
  <Provider store={store} >
  {component}
  </Provider>
  
)
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

it('renders Logistics Orchestration', () => {
  const { container } = render(<TopBar />)
  expect(container).toHaveTextContent('Logistics Orchestration');
});
 
