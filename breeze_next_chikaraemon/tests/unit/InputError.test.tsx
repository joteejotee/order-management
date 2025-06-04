import { render, screen } from '@testing-library/react';
import InputError from '@/components/InputError';

describe('InputError', () => {
  it('エラーメッセージがない場合は何も表示されない', () => {
    const { container } = render(<InputError />);
    expect(container.firstChild).toBeNull();
  });

  it('単一のエラーメッセージが表示される', () => {
    const messages = ['必須項目です'];
    render(<InputError messages={messages} />);

    expect(screen.getByText('必須項目です')).toBeInTheDocument();
  });

  it('複数のエラーメッセージが表示される', () => {
    const messages = ['必須項目です', 'パスワードが短すぎます'];
    render(<InputError messages={messages} />);

    expect(screen.getByText('必須項目です')).toBeInTheDocument();
    expect(screen.getByText('パスワードが短すぎます')).toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    const messages = ['エラーメッセージ'];
    render(<InputError messages={messages} className="custom-class" />);

    const errorElement = screen.getByText('エラーメッセージ');
    expect(errorElement).toHaveClass('custom-class');
    expect(errorElement).toHaveClass('text-sm');
    expect(errorElement).toHaveClass('text-red-600');
  });

  it('空の配列の場合は何も表示されない', () => {
    const { container } = render(<InputError messages={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
