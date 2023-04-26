import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { UserContext } from "../App";
import { ROUTES } from "./routes";


export default function Layout({ signIn, signOut }: { signIn: () => Promise<string>, signOut: () => Promise<void> }) {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const user = useContext(UserContext)
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleSignIn = async () => {
        await signIn();
    }

    const mainPages = ROUTES.filter(route => route.mainPath)



    return <>
        <AppBar
            position="fixed"
        >
            <Toolbar>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleOpenNavMenu}
                    sx={{ flexGrow: 0, display: { md: 'none', xs: "flex" } }}
                    size="large"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {mainPages.map((page) => (
                        <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}>
                            <Typography textAlign={"center"}>{page.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>

                <Typography
                    variant="h5"
                    noWrap
                    mr={2}
                    flexGrow={0}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    {"enekrend.hu".toUpperCase()}
                </Typography>
                <Typography
                    variant="h5"
                    noWrap
                    mr={2}
                    flexGrow={1}
                    sx={{ display: { xs: 'flex', md: 'none' }, }}
                >
                    {"enekrend.hu".toUpperCase()}
                </Typography>
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexGrow: 1,

                    }}
                >

                    {mainPages.map((page) => (
                        <Button key={page.name} color="inherit" onClick={() => { navigate(page.path) }}>
                            {page.name}
                        </Button>
                    ))}
                </Box>


                {user ? <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title={user.displayName}>
                        <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                            <Avatar alt={user.displayName ?? undefined} src={user.photoURL ?? undefined} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: "1rem" }}
                        anchorEl={anchorElUser}
                        keepMounted
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        onClick={handleCloseUserMenu}
                    >
                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/profile/" + user.uid); }}>
                            <Typography textAlign={"center"}>Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => { handleCloseUserMenu(); signOut(); navigate("/") }}>
                            <Typography textAlign={"center"}>Sign out</Typography>
                        </MenuItem>

                    </Menu>
                </Box>
                    : <Button color="inherit" onClick={handleSignIn} sx={{ flexGrow: 0 }}>Login</Button>}
            </Toolbar>
        </AppBar>

        <Toolbar />
        <Container maxWidth={"xl"}>
            <Outlet />
        </Container>

    </>
}