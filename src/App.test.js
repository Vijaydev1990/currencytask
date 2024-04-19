import {render, screen} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const primaryButton = screen.getByRole('button');
  expect(primaryButton).toHaveClass('MuiButtonBase-root');
});
test('Check submit button', () => {
  render(<App />);
  const button = screen.getByTestId('orderModuleHeaderButton');
  expect(screen.getByText('Some content')).toBeInTheDocument();
});
