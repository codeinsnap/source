 
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import DashboardHeader from '.'
 
const render = (component:any) => rtlRender(
  <Provider store={store} >
  {component}
  </Provider> 
);

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

it('renders Dashboard Header', () => {
  const { container } = render(<DashboardHeader />)
  expect(container).toBeTruthy();
});
 
