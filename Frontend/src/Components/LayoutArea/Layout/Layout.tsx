import { Header } from "../Header/Header";
import { Routing } from "../Routing/Routing";
import "./Layout.css";

export function Layout() {
    return (
        <div className="Layout">
            <Header />
            <main className="Layout__main">
                <Routing />
            </main>
        </div>
    );
}
