import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({box, imageUrl }) => {
	return(
		<div className='center na'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={ imageUrl } width='500px' heigh='auto' />
				<div className='bounding_box' style= {{top:box.y1, right:box.x2, bottom:box.y2, left:box.x1}}></div>
			</div>
		</div>
	);
}

export default FaceRecognition;