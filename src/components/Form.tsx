import React, { useState } from 'react'
import isLeapYear from 'leap-year'

const Form = () => {
    const [year, setYear]= useState<number>(2021)
    const [zone, setZone]= useState<string>('metropole')    

    const [rttDays, setRttDays]= useState<number>(0)
    const [displayResult, setDisplayResult]= useState<boolean>(false)    

    const displayYears = () => {
        let currentYear = new Date().getFullYear()
        let arrayYears: number[] = []

        for (let index = (currentYear - 21 ); index < (currentYear + 5); index++) {
            arrayYears.push(index)                  
        }

        return arrayYears
    }

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (year !== null && zone !== '') {
            try {                
                const response = await window.fetch(`https://calendrier.api.gouv.fr/jours-feries/${zone}/${year}.json`)
                const data = await response.json()

                let numberOfDays;

                if (isLeapYear(year)) {
                    numberOfDays = 366
                } else {
                    numberOfDays = 365
                }                

                let weekendDaysArray: number[] = [] 
                let weekendDays; 

                for (let i = 0; i < 12; i++) {                    
                    for (let j = 0; j < 31; j++) {  
                        if (new Date(year, i, j).getDay() === 0 || new Date(year, i, j).getDay() === 6) {
                            weekendDaysArray.push(new Date(year, i, j).getDay())                            
                        }                        
                    }
                }

                weekendDays = weekendDaysArray.length                

                let holidayArray: number[] = [] 
                let holidayOnWeekend; 

                Object.keys(data).forEach((dayOff) => {
                    if (new Date(dayOff).getDay() !== 0 && new Date(dayOff).getDay() !== 6) {
                        holidayArray.push(new Date(dayOff).getDay())
                    }
                       
                })
                
                holidayOnWeekend = holidayArray.length
                
                let cp = 25
                let maxDaysWork = 218

                let rttDaysTotal = numberOfDays - maxDaysWork - weekendDays - holidayOnWeekend - cp

                setRttDays(rttDaysTotal)
                setDisplayResult(true)
            } catch (err) {
                console.log(err);                
            } 
        }        
    }


    return (
        <form onSubmit={handleOnSubmit}>
            <div>
                <label>Année</label>
                <select name="year" id="year" onChange={(e) => setYear(Number(e.target.value))} defaultValue={new Date().getFullYear()}>
                    { displayYears().map((year) => {
                        
                        return <option key={year} value={year}>{year}</option>    
                        
                    })}
                </select>
            </div>

            <div>
                <label>Zone</label>
                <select name="zone" id="zone" onChange={(e) => setZone(e.target.value)} defaultValue="metropole">
                    <option value="metropole">metropole</option>
                    <option value="alsace-moselle">alsace-moselle</option>
                    <option value="guadeloupe">guadeloupe</option>
                    <option value="guyane">guyane</option>
                    <option value="la-reunion">la-reunion</option>
                    <option value="martinique">martinique</option>
                    <option value="mayotte">mayotte</option>
                    <option value="nouvelle-caledonie">nouvelle-caledonie</option>
                    <option value="polynesie-francaise">polynesie-francaise</option>
                    <option value="saint-barthelemy">saint-barthelemy</option>
                    <option value="saint-martin">saint-martin</option>
                    <option value="saint-pierre-et-miquelon">saint-pierre-et-miquelon</option>
                    <option value="wallis-et-futuna">wallis-et-futuna</option>
                </select>
            </div>        

            <button type="submit">
                Calcul RTT
            </button>

            
                { displayResult ? <span>  <p>{rttDays} Jours</p>  </span>: ''}
            
            

        </form>
    )
}

export default Form
