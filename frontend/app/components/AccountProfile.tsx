"use client"
import { useUser } from "@auth0/nextjs-auth0/client"
import NavBar from "./NavBar"

type Props = {
    styles: NavStyles
}

type NavStyles = {
    MainNav: string;
    MainNavText: string;
}

const AccountProfile:React.FC<Props> = ({styles}) => {
  return (
    <>  
        {useUser().user ? 
        <div>
            <NavBar items={[{ Link: "/", Name: "Home" }, { Link: "/profile", Name: "My Profile" }]} ContainerStyles={styles.MainNav} TextStyles={styles.MainNavText}/>
            <a href="/api/auth/logout">Logout of ClassCade</a>
        </div>
        : 
        <NavBar items={[{ Link: "/", Name: "Home" }, { Link: "/about", Name: "About" }]} ContainerStyles={styles.MainNav} TextStyles={styles.MainNavText}/>
        }
    </>
  )
}

export default AccountProfile