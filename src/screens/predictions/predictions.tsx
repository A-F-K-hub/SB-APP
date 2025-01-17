
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { geFilteredFixturesAction } from '../../reducers/fixtures/fixtures.actions';
import { FixturesFilterModel } from '../../models/fixtures';
import images from '../../assets/images';
import CheckBoxIcon  from '@mui/material/Checkbox';
import { ChangeEvent } from 'react';
import { betOptions } from '../../variables/variables';

const PredictionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedBetOptions, setSelectedBetOptions] = useState<{name: String, id: number}[]>();
  const selectedLeagues  =  location.state
  
  useEffect(()=>{
    window.addEventListener('resize', updateWindowDimensions)
    return ()=>{
      window.removeEventListener('resize', updateWindowDimensions)
    }
  }, []);

  const handleNextClick =()=>{
    return navigate('/fixtures', {state: {
      selectedBetOptions,
      selectedLeagues
  }})
  }

const updateWindowDimensions =()=>{
  setWindowHeight(window.innerHeight);
  setWindowWidth(window.innerWidth);
}

const handleOptionSelect =(e:ChangeEvent<HTMLInputElement>, option: {id: number, name: String})=>{
    if(e.target.checked){
        if(selectedBetOptions){
            if(selectedBetOptions.every(betOption => betOption.id !== option.id)){
                setSelectedBetOptions([...selectedBetOptions, option])
            }
        }
        else{
            setSelectedBetOptions([option])
        }
    }else{
        if(selectedBetOptions && selectedBetOptions.some(betoption => betoption.id === option.id)){
            setSelectedBetOptions(selectedBetOptions.filter(betOptionSelected=> betOptionSelected.id !== option.id))
        }
    }
 
}

  return (
    <div style={{
      backgroundImage:` url(${images.bgImage})`,
      backgroundRepeat:'no-repeat',
      backgroundSize: 'cover',
      width: windowWidth,
      height: windowHeight,
    }}
    className=" flex flex-grow items-center flex-col justify-center pb-10 pt-28"
    >
       <div className=' flex flex-row  w-full justify-center'>
          <div className=' flex font-bold self-center text-lg py-2 bg-white h-14 w-64 mb-5 items-center justify-center text-center'>Select Bet Options</div>
        </div>
        <div className='flex flex-col w-9/12 overflow-y-scroll items-center'>
       
                {betOptions.map(betOption=>{
                    return (<div key={`${betOption.id}`} className=' flex flex-row justify-between py-6 my-2 px-3 w-4/6 rounded-md bg-blue-300 hover:bg-blue-200'>
                        <CheckBoxIcon onChange={(e)=> handleOptionSelect(e, betOption)} size="medium"/>
                        <div className=' flex text-lg font-semibold items-center justify-center text-black'>{betOption.name}</div>
                        <div/>
                    </div>)
                })}
            </div>
            <button disabled={!selectedBetOptions || selectedBetOptions?.length ===0} style={{backgroundColor:!selectedBetOptions|| selectedBetOptions?.length ===0? 'gray': 'rgb(96 165 250)'}} className=' flex bg-blue-400 rounded p-4 items-center justify-center self-end w-60 text-black hover:bg-blue-200 mr-5' onClick={handleNextClick}>
                Next
            </button>
        </div>
        
  );
};

export default PredictionsScreen;
