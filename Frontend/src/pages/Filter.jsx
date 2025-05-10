import { Box } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';


const Filter = forwardRef((props, ref)=>{

    const [state, setState] = useState(false)

    const modal = useRef()
    const modalContainer = useRef()

    const hideModal = ()=>{
        let strClass = modal.current.className.split(' ')
        if (!strClass.includes("hidden")&&modal.current){
            const newClass = strClass.filter(item => item!='open')
            newClass.push('hidden')
            modal.current.className = newClass.join(' ')
        }
    }
    const openModal = ()=>{
        console.log('mo modal')
        let strClass = modal.current.className.split(' ')
        if (strClass.includes("hidden")&&modal.current){
            const newClass = strClass.filter(item => item!='hidden')
            newClass.push('open')
            console.log(newClass)
            modal.current.className = newClass.join(' ')
        }
    }
    
    useImperativeHandle(ref, ()=>(
        {openModal}
    ))

    useEffect(()=>{
        if (modal) {
            console.log(modal)
            modal.current.addEventListener('click', hideModal)
        }
        if (modalContainer) modalContainer.current.addEventListener('click', function(e){
            e.stopPropagation();
        })
    }, [])

    useEffect(
        ()=>{
            
        }
    )

    return (
        <Box ref={modal} className={'modal hidden'}>
            <Box ref={modalContainer} className={'modal_container'}>
                <Box className="filter_header">Filters</Box>
                <Box className="filter_body">
                    <label htmlFor="classes">Classes</label>
                    <input name="classes"></input>
                </Box>
                <Box className="filter_footer">
                    <button className='button'>Đóng</button>
                </Box>
            </Box>
        </Box>
    )
});

export default Filter