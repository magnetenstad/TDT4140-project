import * as React from 'react';
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import { display } from '@mui/system';

export default function AgeFilter() {
    const [val, setVal]=React.useState([18,99])
    const updateRange=(e,data) => {
        setVal(data);
        console.log(data)
        
    }

    const handleChange = (event, newValue) => {
        console.log(oldValue);   
    }
    return (
        
        <Stack alignItems="center">
            <Slider
            onChangeCommitted={updateRange}
            value={val}
            step={1}
            min={18}
            max={99}
            valueLabelDisplay="on"
            sx={{ width: 150 }}
            />
        </Stack>
    );
};
