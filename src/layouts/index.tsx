import { SetLang } from "@/components";
import { Link, Outlet } from "umi";
import styles from "./index.less";

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>Burnable</li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a href="https://github.com/yinyanfr/burnable">Github</a>
        </li>
        <li>
          <SetLang />
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
