import '../App.css';
import  ImageUp from '../components/ImageUp';
import '../minesweeper.css';
import '../image.css';

export default function About () {
  return (
    <div>

      <p>Consider using this page to grab/display recently uploaded pictures (by all users)</p>
      <p>However, this would mean creating a new model called Image which is connected to user models but holds all image urls</p>
<p>probably better to implement that after main app working and images going up to cloud</p>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <ImageUp />
</div>
</div>
{/* -------------- */}

    </div>
  );
}
