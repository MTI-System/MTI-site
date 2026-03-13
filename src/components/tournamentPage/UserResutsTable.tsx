"use client"

import { useGetTournamentUserResultsQuery } from "@/api/tournaments/clientApiInterface"
import Loading from "@/app/loading"
import { useMemo, useState } from "react"

export default function UserResultsTable({ tournamentId }: { tournamentId: number }) {
    const { data: resTable } = useGetTournamentUserResultsQuery({ id: tournamentId })

    interface Member {
        name: string;
        team: string;
        total: number;
        rep_max: number;
        rep_avg: number;
        opp_max: number;
        opp_avg: number;
        rew_max: number;
        rew_avg: number;
    };

    interface Column {
        field: keyof Member;
        header: string;
    };

    interface SortConfig {
        key: keyof Member | null;
        direction: string;
    }

    const tableData = useMemo(() => {
        if (!resTable) return [];

        return resTable.results.map(result => ({
            name: result.user_third_name ? `${result.user_second_name} ${result.user_first_name}. ${result.user_third_name}.` : `${result.user_second_name} ${result.user_first_name}.`,
            team: result.team.name,
            total: result.total_score.toFixed(2),
            rep_max: result.rep_max.toFixed(2),
            rep_avg: result.rep_avg.toFixed(2),
            opp_max: result.opp_max.toFixed(2),
            opp_avg: result.opp_avg.toFixed(2),
            rew_max: result.rew_max.toFixed(2),
            rew_avg: result.rew_avg.toFixed(2),
        }));
    }, [resTable]);

    const columns: Column[] = [
        { field: 'name', header: 'Участник' },
        { field: 'team', header: 'Команда' },
        { field: 'total', header: 'Сумма баллов' },
        { field: 'rep_max', header: 'Лучший док.' },
        { field: 'rep_avg', header: 'Средний док.' },
        { field: 'opp_max', header: 'Лучшее опп.' },
        { field: 'opp_avg', header: 'Среднее опп.' },
        { field: 'rew_max', header: 'Лучшая рец.' },
        { field: 'rew_avg', header: 'Средняя рец.' }
    ]

    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ASC' });

    const selectSort = (key: keyof Member) => {
        let direction = 'ASC';
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }
        if (sortConfig.key === key && sortConfig.direction === 'DESC') {
            direction = 'none';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (sortConfig.key === null || sortConfig.direction === 'none') return tableData;
        const key = sortConfig.key;

        return [...tableData].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];

            if (key === 'name' || key === 'team') {
                const compare = valA.localeCompare(valB);
                return sortConfig.direction === 'ASC' ? compare : -compare;
            }

            const numA = Number(valA);
            const numB = Number(valB);

            if (isNaN(numA) || isNaN(numB)) {
                return 0;
            }
            const compare = numA - numB;
            return sortConfig.direction === 'ASC' ? compare : -compare;
        });
    }, [tableData, sortConfig]);

    return (
        <>
            {(!resTable || !tableData) && <Loading />}
            {resTable && tableData && <div className="mx-10 overflow-auto border border-border rounded-2xl text-text-main">
                <table className="w-full">
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th key={column.field} className="px-3 py-2 cursor-pointer"
                                    onClick={() => selectSort(column.field)}>
                                    <div className="flex gap-1 items-center justify-center">{column.header}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((member, index) => (
                            <tr key={index} className="border-t border-border rounded-2xl">
                                {columns.map((column) => (
                                    <td key={column.field} className={`truncate py-2 px-3 ${(column.field === 'name') ? 'text-left' : 'text-center'}`}>
                                        {member[column.field]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </>
    )
}
