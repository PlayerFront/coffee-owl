import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./utils/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }
}));

test('рендерит App без ошибок', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
