import React from 'react';

const SKeletonLoader = () => {
    return (
		<div className="flex bg-slate-100 flex-col m-8 rounded shadow-md w-60 sm:w-80 animate-pulse h-96">
			<div className="h-48 rounded-t bg-slate-200"></div>
			<div className="flex-1 px-4 py-8 space-y-4 sm:p-8 ">
				<div className="w-full h-6 rounded bg-slate-200 "></div>
				<div className="w-full h-6 rounded bg-slate-200"></div>
				<div className="w-3/4 h-6 rounded bg-slate-200"></div>
			</div>
		</div>
	);
};

export default SKeletonLoader;