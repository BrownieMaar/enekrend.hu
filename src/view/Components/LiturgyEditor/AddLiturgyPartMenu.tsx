import { LiturgyPart, liturgyPartTypes } from "../../../model/types/LiturgyTypes";
import { Menu, MenuItem } from "@mui/material";
import { GetWizardComponentFromPartType } from "../LiturgyEditor";

export function AddLiturgyPartMenu(
    { anchorEl, onClose, submitPart, setPopupContent }: {
        anchorEl: HTMLElement | null;
        onClose: () => void;
        submitPart: (part: LiturgyPart) => void;
        setPopupContent: (content: React.ReactNode) => void;
    }) {

    const open = Boolean(anchorEl);
    const onPopupClose = () => setPopupContent(null);

    const wizardProps = { submitPart, onClose: onPopupClose };
    return (<>
        <Menu
            id="liturgy-part-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {liturgyPartTypes.map((partType, index) => <MenuItem
                sx={{ px: 2 }}
                key={index}
                onClick={(_) => { onClose(); setPopupContent(GetWizardComponentFromPartType(partType.value, wizardProps)); }}
            >
                {partType.name}
            </MenuItem>
            )}
        </Menu>
    </>
    );
}
