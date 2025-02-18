import { useLocation, useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { useSelector } from 'react-redux';

function CourseDescription() {

  const navigate=useNavigate();
  const { state } = useLocation();

  const { role, data } = useSelector((state) => state.auth)


  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
        <div className="grid grid-cols-2 gap-10 py-10 relative">
          <div className="space-y-5">
            <img
              className='w-[360px] h-[328px] ml-40'
              src={state?.thumbnail?.secure_url}
              alt="thumbnail"
            />
            <div className='space-y-4'>
              <div className="flex flex-col items-center justify-between text-xl">
                <p className='font-semibold'>
                  <span className='text-yellow-500 font-bold'>
                    Total Lectures :{" "}
                  </span>
                  {state?.numberOfLectures}
                </p>

                <p className='font-semibold'>
                  <span className='text-yellow-500 font-bold'>
                    Instructor :{" "}
                  </span>
                  {state?.createdBy}
                </p>

              </div>

              {
                role === "ADMIN" || data?.subscription?.status === 'active' ? (
                  <button onClick={()=>navigate('/course/displaylectures',{state:{...state}})} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 hover:bg-yellow-500 transition-all ease-in-out duration-300">
                    Watch Lectures
                  </button>
                ) : (
                  <button className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 hover:bg-yellow-500 transition-all ease-in-out duration-300"
                  onClick={()=>navigate('/checkout')}
                  >
                    Subscribe
                  </button>
                )
              }
            </div>
          </div>

          <div className="space-y-2 text-xl ">
            <h1 className='text-3xl font-bold text-yellow-500 mb-5 text-center'>
              {state?.title}
            </h1>

            <p>  Course Description: </p>
            <p>{state?.description}</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default CourseDescription;