export function Action({ text, onExecute }) {
  return (
    <div className="panel">
      <p>{text}</p>
      <button onClick={onExecute}>Continue</button>
    </div>
  )
}