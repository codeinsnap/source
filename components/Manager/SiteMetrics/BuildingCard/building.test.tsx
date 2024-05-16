 
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import BuildingCard from '.'
 
const render = (component:any) => rtlRender(
  <Provider store={store} >
  {component}
  </Provider>
  
)
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

it('renders BuildingCard unchanged', () => {
  const { container } = render(<BuildingCard />)
  expect(container).toBeTruthy()
})


 
