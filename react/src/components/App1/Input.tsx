export default function Input(
  { type, name, label, value, onChange, min, max }:
  {
    type?: React.HTMLInputTypeAttribute;
    name?: string;
    label: string;
    value?: string;
    min?: number;
    max?: number;
    onChange?: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  }
) {
  return (
    <div className='input'>
      <input type={type} name={name} id={name} value={value} min={min} max={max} onChange={onChange} />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}
