import { SetStateAction } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    children?: JSX.Element;
}

const CustomBottomSheet = ({ open, setOpen, children }: Props) => {
    return (
        <BottomSheet
            open={open}
            scrollLocking={false}
            onDismiss={() => setOpen(false)}
            snapPoints={({ maxHeight }) => [maxHeight * 0.5]}
        >
            {children}
        </BottomSheet>
    );
};

export default CustomBottomSheet;
