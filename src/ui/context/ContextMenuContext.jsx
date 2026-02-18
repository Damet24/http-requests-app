import { createContext, useContext, useState, useEffect, useRef } from "react";

const ContextMenuContext = createContext({});

export function ContextMenuProvider({ children }) {
    const [menu, setMenu] = useState(null);
    const menuRef = useRef(null);

    const showMenu = ({ x, y, items }) => {
        setMenu({ x, y, items });
    };

    const closeMenu = () => setMenu(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (!menuRef.current) return;

            if (menuRef.current.contains(e.target)) return;

            closeMenu();
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") closeMenu();
        };

        window.addEventListener("mousedown", handleClick);
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <ContextMenuContext.Provider value={{ showMenu }}>
            {children}

            {menu && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 min-w-[160px]"
                    style={{ top: menu.y, left: menu.x }}
                >
                    {menu.items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.onClick();
                                closeMenu();
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </ContextMenuContext.Provider>
    );
}

export function useContextMenu() {
    return useContext(ContextMenuContext);
}
