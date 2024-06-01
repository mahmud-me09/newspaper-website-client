import React from 'react';
import { Link } from 'react-router-dom';

const SectionTitle = ({h1}) => {
    return (
		<div className="border-b-4 border-gray-300 border-double">
			<h1 className="text-4xl mb-3">{h1}</h1>
		</div>
	);
};

export default SectionTitle;