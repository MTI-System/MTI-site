import { useGetUserByIdQuery } from '@/api/users/clientApiInterface';
import { Avatar } from '@base-ui-components/react/avatar';

const Cell = ({juryID}:{juryID: number}) => {
        const { data: userData, isLoading: userIsLoading } = useGetUserByIdQuery({ id: juryID })
        return(
        <a href='/' className='flex flex-col text-text-main text-center text-wrap justify-center items-center'>
          <Avatar.Root className="uppercase inline-flex size-12 sm:size-16 mb-2 items-center justify-center overflow-hidden rounded-full bg-hover align-middle text-base font-medium text-text-main select-none">
          {userData ? userData.firstName[0] : juryID}
          </Avatar.Root>
          <p>{userData ? userData.firstName : ""}</p>
          <p>{userData ? userData.secondName : ""}</p>
        </a>
      )
    };

export function UserAvatarWithTitleByID(
  {PeoplesIDs}:{PeoplesIDs: number[]|undefined}) {
  return (
    <>
    {PeoplesIDs?.map((id) => (
        <Cell key={id} juryID={id}/>
    ))}
    </>
  )
}
