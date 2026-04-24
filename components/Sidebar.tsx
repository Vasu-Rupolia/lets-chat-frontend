type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    
    return (
        <>
            {/* Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
      />
    )}

        <aside
          className={`
            fixed top-0 left-0 z-50
            h-screen w-64 bg-white shadow-md p-4

            transform transition-transform duration-300

            ${isOpen ? "translate-x-0" : "-translate-x-full"}

            md:translate-x-0 md:static md:h-[calc(100vh-64px)]
          `}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-600">Menu</h2>

          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            👥 All Users
          </button>

          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            🤝 Friend Requests
          </button>

          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            ⭐ Skill Matches
          </button>
        </aside>
        </>
    );
    
}