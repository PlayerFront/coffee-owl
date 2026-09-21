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

// jest.mock('swiper/react', () => ({
//   Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
//   SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
// }));

// jest.mock('swiper/modules', () => ({
//   Autoplay: () => null,
//   Pagination: () => null,
// }));

// jest.mock('swiper/css', () => ({}));
// jest.mock('swiper/css/pagination', () => ({}));

test('рендерит App без ошибок', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
