import {useState, useCallback} from 'react';

/**
 * @param {string} initial - The initial sorting criteria
 * @returns {[function, string, function, boolean, function]} - The sorting function, the current sorting criteria, the function to set the sorting criteria, the inverse flag, the function to set the inverse flag
 * 
 */
export default function useSorting(initial=null){
    const [sortCriteria, setSortCriteria] = useState(initial);
    const [inverse, setInverse] = useState(false);


    const sorter = useCallback((a,b)=>{
        if(!sortCriteria){
            return 0;
        }
        if( typeof a[sortCriteria] === 'string' && typeof b[sortCriteria] === 'string'){
            if(a[sortCriteria].toLowerCase() < b[sortCriteria].toLowerCase())
                return inverse ? 1 : -1;
            if(a[sortCriteria].toLowerCase() > b[sortCriteria].toLowerCase())
                return inverse ? -1 : 1;
            return 0;
        }
        if(a[sortCriteria] === undefined && b[sortCriteria] !== undefined){
            return inverse ? -1 : 1;
        }
        if(a[sortCriteria] !== undefined && b[sortCriteria] === undefined){
            return inverse ? 1 : -1;
        }
        if(a[sortCriteria] < b[sortCriteria])
            return inverse ? 1 : -1;
        if(a[sortCriteria] > b[sortCriteria]){
            return inverse ? -1 : 1;
        }
        return 0;
    },[sortCriteria,inverse])

    return [sorter, sortCriteria, setSortCriteria, inverse, setInverse];
}