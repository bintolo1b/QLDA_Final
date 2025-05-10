import React, { useEffect, useRef, useState } from 'react';
import './AssignmentPage.css';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Filter from './Filter';

const status = [
  'Upcoming',
  'Past due',
  'Compelete'
]

function AssignmentPage() {
  const [currentPage, setCurrentPage] = useState('Upcoming')
  const [stateGoTop, setStateGoTop] = useState(false)

  const filterModal = useRef()
  

  useEffect(()=>{
    const handleGoToTop = () => {
      console.log(window.scrollY)
      setStateGoTop(window.scrollY>=250)
    }

    window.addEventListener('scroll', handleGoToTop)

    return ()=>{
      window.removeEventListener('scroll', handleGoToTop)
    }
  },[])




  
  return (
    <Box sx={{ padding: 3, height: '100vh', overflowY: 'auto' }}>
      <Box className={'assignment_header'}>
        <Box>
          {
            status.map((stt)=>{
              return <button
                      key={stt}
                      onClick={()=>setCurrentPage(stt)}  
                      className={currentPage===stt?'button mr-8 button_selected':'button mr-8'}>
                        {stt}
                    </button>
            })
          }
        </Box>
        <Box className='mr-62 filter' onClick={()=>filterModal.current?.openModal()}>
        <FilterListIcon/>  
        </Box>
      </Box>
      {currentPage==='Upcoming'&&<Upcoming></Upcoming>}
      {
        stateGoTop && 
        <button 
          className='btn_goTop'
          onClick={()=>{window.scrollTo({top:0, behavior: 'smooth'})}}>
              <KeyboardArrowUpIcon/>
              Go to top
        </button>
      }
      <Filter ref={filterModal} ></Filter>
    </Box>
  );
}

export default AssignmentPage;

const Assignments = [
  {
    id:1,
    nameAssignment: 'Xây dựng game caro',
    nameClass: 'Group_AI_22Nh12',
    deadline: '2025-12-24T00:00:00',
    submitStatus: true,
    timeSubmit: '2025-12-24T19:00:00'
  },
  {
    id:2,
    nameAssignment: 'Xây dựng game cờ vua',
    nameClass: 'Group_AI_22Nh12',
    deadline: '2025-12-24T00:00:00',
    submitStatus: true,
    timeSubmit: '2025-12-24T16:00:00'
  },
  {
    id:3,
    nameAssignment: 'QLDA 1',
    nameClass: 'Group_QLDA_22Nh14',
    deadline: '2025-12-23T00:00:00',
    submitStatus: true,
    timeSubmit: '2025-12-23T19:00:00'
  },
  {
    id:4,
    nameAssignment: 'Math',
    nameClass: 'Group_Math_22Nh14',
    deadline: '2025-12-22T00:00:00',
    submitStatus: true,
    timeSubmit: '2025-12-24T22:00:00'
  },
  {
    id:5,
    nameAssignment: 'History',
    nameClass: 'Group_History_22Nh14',
    deadline: '2025-12-22T00:00:00',
    submitStatus: true,
    timeSubmit: '2025-12-24T19:00:00'
  },
  {
    id:6,
    nameAssignment: 'Football',
    nameClass: 'Group_Football_22Nh14',
    deadline: '2025-12-22T00:00:00',
    submitStatus: false,
    timeSubmit: null
  },
  {
    id:7,
    nameAssignment: 'Swimming',
    nameClass: 'Group_Swimming_22Nh14',
    deadline: '2025-12-25T00:00:00',
    submitStatus: false,
    timeSubmit: null
  },
  {
    id:8,
    nameAssignment: 'Swimming',
    nameClass: 'Group_Swimming_22Nh14',
    deadline: '2025-12-25T00:00:00',
    submitStatus: false,
    timeSubmit: null
  }
]



function Upcoming(){
  const [groupAssign, setGroupAsign] = useState({})
  
  useEffect(()=>{
    const tempGroup = {}
    Assignments.forEach(assignment=>{
      const deadline = assignment.deadline.split('T')[0]
      if (!tempGroup[deadline]){
        tempGroup[deadline] = []
      }
      tempGroup[deadline].push(assignment)
    })
    setGroupAsign(tempGroup)

    return ()=>{
      setGroupAsign({})
    }
  }, [])

  return (
    <div>
      {
        Object.entries(groupAssign).map((gr)=>{
          return (
            <div className='groupAssign' key={gr[0]} >
              <h3>{gr[0]}</h3>
              {
                gr[1].map((item)=>{
                  return (
                    <AssignmentItem {...item} key={item.id} />
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

function AssignmentItem({id, nameAssignment, nameClass, submitStatus, timeSubmit}){
  return (
    <button key={id} className='AItem mb-16'>
        <Box
         className='AItem_img' component='img' src='https://png.pngtree.com/png-clipart/20220424/original/pngtree-astronaut-cartoon-simple-white-png-image_7555428.png'/>
        <Box className='AItem_content' >
          <Box className='item_content-header mt-8'>{nameAssignment}</Box>
          <Box className='item_content'>Submitted at {timeSubmit}</Box>
          <Box className='item_content'>{nameClass}</Box>
        </Box>
        <TurnIn submitStatus={submitStatus}/>
    </button>
  )
}

function TurnIn({submitStatus}){
  return (
    <Box>
      {
        (submitStatus && 
        (
         <Box className='success'>
          <CheckIcon style={{fontSize: '16px'}}/>
          <Box className='ml-2'>Turned in</Box></Box>
        ))||
        (
          <Box className='disable'>
          <BlockIcon style={{fontSize: '16px'}}/>
          <Box className='ml-2'>Not turned in</Box></Box>
        )
      }
    </Box>
  )
}
