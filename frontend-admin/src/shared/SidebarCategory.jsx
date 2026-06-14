export default function SidebarCategory({ text, handler, isActive, icon }) {
  return <li>
    <button class={isActive ? 'activeNavBtn sidebarBtn' : 'sidebarBtn'} onClick={handler}>
      {icon}
      <span class="sidebarLabel">{text}</span>
    </button>
  </li>
}