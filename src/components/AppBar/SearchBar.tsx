import { Paper, InputBase, IconButton } from "@mui/material";
import { Search } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useLazySearchPropertyQuery } from "../../hooks/api/property.api";
import { debounce } from 'lodash-es'



const SearchBar = ({searchValue, onChange}) => {


    return (
        <Paper sx={{ p: '1px 2px', display: "flex", width: '300px', justifyContent: 'space-between' }}>
            <InputBase sx={{ flex: 1 }} placeholder="Search Property" value={searchValue} onChange={onChange} />
            <IconButton>
                <Search />
            </IconButton>
        </Paper>
    )
}

export default SearchBar;