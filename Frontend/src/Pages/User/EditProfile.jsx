import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";


function EditProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
        previewImage: "",
        fullName: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage)
            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                })
            })
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        console.log("DAtA" ,data); // checking 
        if (!data.fullName || !data.avatar) {
            toast.error("All fields are mandatory");
            return;
        }
        if (data.fullName.length < 4) {
            toast.error("Name cannot be less than 4 characters")
            return ;
        }
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("avatar", data.avatar);
        console.log("formData : ",formData.entries().next());
        console.log("formData : ",formData.entries().next());

        await dispatch(updateProfile([data.userId, formData]));

        await dispatch(getUserData());

        navigate("/user/profile");
    }


    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form noValidate onSubmit={onFormSubmit} className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-semibold">Edit Profile</h1>

                    <label htmlFor="image_uploads"
                        className="cursor-pointer"
                    >
                        {data.previewImage ?
                            (
                                <img
                                    className="w-28 h-28 rounded-full m-auto"
                                    src={data.previewImage}
                                />
                            ) : (
                                <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                            )}
                    </label>
                    <input
                        className="hidden"
                        onChange={handleImageUpload}
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        accept=".jpg, .png, .svg, .jpeg"
                    />
                    <div className="flex flex-col gap-1 ">
                        <label htmlFor="fullName" className="text-lg font-semibold">FullName</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            id="fullName"
                            placeholder="Enter Your name"
                            className="bg-transparent px-2 py-1 border"
                            value={data.fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 text-lg rounded-sm cursor-pointer bg-yellow-600 hover:bg-yellow-500 transiton-all ease-in-out duration-300 ">
                        Update Profile
                    </button>
                    <Link to="/user/profile">
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Go Back to profile
                        </p>
                    </Link>
                </form>
            </div>
        </HomeLayout>
    )
}

export default EditProfile;

// error while navigating to profile page the image is gettting updated but the fullName is not getting updated