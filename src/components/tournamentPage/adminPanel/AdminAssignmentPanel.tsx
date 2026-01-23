"use client"
import { useGetFightInfoByTournamentQuery, useGetTournamentCardQuery, useSetTeamsToFightMutation } from "@/api/tournaments/clientApiInterface"
import Loading from "@/app/loading"
import { Button, Input } from "@base-ui-components/react"
import AssignmentTeamsTable from "@/components/tournamentPage/adminPanel/AssignmentTeamsTable"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import AssignmentRoomsTable from "./AssignmentRoomsTable"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function AdminAssignmentPanel({ tournamentId }: { tournamentId: number }) {
  interface FightData {
    fight: number;
    data: number[][];
  }

  const token = useAppSelector((state) => state.auth.token)
  const { data: fights, isLoading: isLoadingFights} = useGetFightInfoByTournamentQuery({ tournamentId: tournamentId })
  const { data: tournamentCard, isLoading: isTournamentCardLoading } = useGetTournamentCardQuery({ id: tournamentId })


  //Формируем список команд для выпадашек AssignmentTeamsTable
  const tournamentTeams = useMemo(() => {
    if (!tournamentCard?.teams) {
      return [];
    }
    return tournamentCard.teams.map(team => ({
      value: team.id,
      label: team.name,
    }));
  }, [tournamentCard]);

  //Вспомогательное для фиксации позиций команд
  const [selections, setSelections] = useState<(number | null)[]>([]);
  useEffect(() => {
    setSelections(new Array(tournamentTeams.length).fill(null));
  }, [tournamentTeams]);

  //Обработка выбора команды
  const handleChange = (tableIndex: number, teamId: number | null) => {
    setSelections(prevSelections => {
      const newSelections = [...prevSelections];
      newSelections[tableIndex] = teamId;
      return newSelections;
    });
  };

  //Получение команды по ее позициции
  const getTeamValue = (num: number) => {
    if (num === 0) {
      return '-';
    }
    const selected = selections[num - 1];
    return selected ? tournamentTeams.find(team => team.value === selected)?.label || num : num;
  }

  const [fileData, setFileData] = useState<FightData[] | null>(null);

  const fileParse = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text().then(text => {
      setFileData(JSON.parse(text));
    }).catch(err => console.error("Ошибка:", err));
  };
  
  const newData = useMemo(() => {
    if (!fights || !fileData) return [];
    const entries = Object.entries(fights);

    return entries.map(([fightId, roomObjects], index) => {
      const item = fileData[index];
      const rooms = roomObjects.map((room) => room.id);

      return {
        fightId,
        rooms,
        data: item?.data,
      };
    });
  }, [fights, fileData]);

  const [setTeamsToFight, { isLoading: isTeamsSettingLoading, isSuccess: isTeamsSettingSuccess }] = useSetTeamsToFightMutation();

  const saveAssignment = () => {
    newData.forEach((fight) => {
      const rows = fight.data;
      const numColumns = rows[0].length;
      const columns: (number | null)[][] = Array.from({ length: numColumns }, () => []);

      rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const value = selections[cell - 1] ?? null;
          columns[colIndex].push(value);
        });
        const data = new FormData()
        // data.set("token", token)
        data.set("token", "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2VtYWlsIjoiYW50b29uLnMuaXZhbm92QGdtYWlsLmNvbSIsInVzZXJfaWQiOjE3MSwicmlnaHRzIjpbXSwibG9naW4iOiJtb2YxdXMiLCJzdWIiOiIxNzEiLCJpYXQiOjE3NjgzNzE5MjAsImV4cCI6MTc2ODUxNTkyMH0.fdsptYldQc1y-CgH0ZX_xVqnKrLARuoRwOeXloDJ3Lg")
        if (fight.rooms[rowIndex]) {
          const dataToSave = Object.fromEntries(data.entries())
          //@ts-ignore
          dataToSave.teams = columns[rowIndex]
          //@ts-ignore
          setTeamsToFight(dataToSave)
        }
      });
    });
  };

  // --------------DELETE LATER-------------
  const roomNames = ["A", "B", "C"]
  // ---------------------------------------

  return (
    <>
      {(isLoadingFights || isTournamentCardLoading) && <Loading />}

      {fights && <div className="flex w-full gap-7.5 px-3">
        <div className="w-[30%] flex flex-col gap-7.5 items-center">
          <AssignmentTeamsTable teams={tournamentTeams} selections={selections} onChange={handleChange} />
          <Button className="cursor-pointer bg-accent-primary-alt border-accent-primary text-accent-primary h-fit w-fit py-1 px-2 rounded-xl border text-xl transition-colors duration-300"
            onClick={() => {
              saveAssignment()
            }}>
            Завершить жеребьёвку
          </Button>
        </div>

        <div className="flex flex-col gap-7.5 w-[70%] items-center justify-center">
          {!fileData && <div className="flex flex-col items-center justify-center gap-7.5 text-center text-text-main">Для составления таблицы рассадки необходимо загрузить файл - конфигурацию.
            <label className="flex flex-col items-center justify-center gap-1 border border-border rounded-2xl w-60 h-15 mb-5">
              <span className="text-md font-medium text-text-main">Загрузить файл</span>
              <input
                type="file"
                accept=".txt"
                onChange={fileParse}
                className="hidden"
              />
            </label>
          </div>}
          {fileData && Object.entries(fights).map(([fightNum, fight], index) => (
            <AssignmentRoomsTable key={fightNum} fightNum={fightNum} rooms={roomNames} config={newData.find(item => item.fightId == fightNum)} getTeamValue={getTeamValue} />
          ))}
        </div>
      </div>}
    </>
  )
}