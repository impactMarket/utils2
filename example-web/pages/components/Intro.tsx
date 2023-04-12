import React, { useState } from 'react';

type IntroProps = {
    handleChange: Function;
    initialOption: string;
    options: string[];
}

const Intro = (props: IntroProps) => {
    const { handleChange, initialOption, options } = props;
    const [selected, setSelected] = useState(initialOption);

    const handleSelectChange = (option: any) => {
        setSelected(option);
        handleChange(option);
    }

    return (
        <div>
            <h1 style={{ display: 'inline-block', marginRight: 16 }}>Development feature</h1>
            <select value={selected} onChange={event => handleSelectChange(event?.target?.value)}>
                <option value="">---</option>
                {(options ?? []).map((option, index) => <option key={index}>{option}</option>)}
            </select>
        </div>
    )
}

export default Intro
