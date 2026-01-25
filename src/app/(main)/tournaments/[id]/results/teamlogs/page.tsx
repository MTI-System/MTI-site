import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import TeamLogsList from "@/components/tournamentPage/teamLogs/TeamList"
import { TeamLogsInterface } from "@/types/TournamentsAPI"

export default async function teamLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const store = makeTournamentsStoreServer()
  // const { data, error } = await store.dispatch(tournamentsApiServer.endpoints.getTeamLogs.initiate({ id: Number(id) }))
  // if (!data) return <p className="text-accent-warning text-xl">Произошла ошибка</p>
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentTable.initiate({ id: Number(id) }))
  const { data: table, error } = await promise
  console.log("tournament fetch", table, error)

  const maxFilledFightsIndex =
    table?.table_lines.map((x, i) => [x.scores.length, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1] ?? 0
  const fights = table?.table_lines[maxFilledFightsIndex].scores.map((s) => ({name: s.fight_container_name, id: s.fight_container_id})) ?? []

  const data: TeamLogsInterface = {
    teams: [
      {
        team: {
          id: 4,
          name: "Все решено",
          global_team_id: 4,
          players: [
            {
              id: 113,
              firstName: "А",
              secondName: "Ковалев",
              thirdName: "А",
            },
            {
              id: 114,
              firstName: "М",
              secondName: "Бисюков",
              thirdName: "Д",
            },
            {
              id: 115,
              firstName: "В",
              secondName: "Малышев",
              thirdName: "А",
            },
            {
              id: 116,
              firstName: "В",
              secondName: "Торунцов",
              thirdName: "А",
            },
            {
              id: 117,
              firstName: "П",
              secondName: "Шумилов",
              thirdName: "А",
            },
          ],
        },
        reported: [
          {
            id: 760,
            global_number: 17,
            year: 2024,
            problem_translations: [
              {
                id: 763,
                problem_name: "Квантовая тень",
                problem_text:
                  "Если поместить пламя, подкрашенное поваренной солью, перед натриевой газоразрядной лампой, то пламя будет отбрасывать тень. Тень может стать светлее, если пламя поместить в сильное магнитное поле. Исследуйте и объясните это явление.",
                problem_by: "Задания XLVI Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 64,
                title: "Квантовая физика",
                icon_src: "QuantumIcon.svg",
                tile_color: "#1097e6",
                dark_theme_tile_color: "#02c4ff",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
          {
            id: 761,
            global_number: 1,
            year: 2025,
            problem_translations: [
              {
                id: 764,
                problem_name: "Придумай сам",
                problem_text:
                  "Сделайте возвращающийся бумеранг, складывая и/или разрезая лист бумаги. Исследуйте, как полёт бумеранга зависит от существенных параметров.",
                problem_by: "Задания XLVII Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 38,
                title: "Аэродинамика",
                icon_src: "AeroDynamicsIcon.svg",
                tile_color: "#13add8",
                dark_theme_tile_color: "#00c5d2",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 81,
                title: "Механика",
                icon_src: "MechanicSectionIcon.svg",
                tile_color: "#0a64f5",
                dark_theme_tile_color: "#3d99ff",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
          {
            id: 762,
            global_number: 2,
            year: 2025,
            problem_translations: [
              {
                id: 765,
                problem_name: "Воздушная мышца",
                problem_text:
                  "Поместите воздушный шарик внутрь цилиндрической сетки (в такую сетку иногда упаковывают чеснок). При надувании шарика сетка будет расширяться и укорачиваться. Изучите свойства такой «мышцы».",
                problem_by: "Задания XLVII Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
              {
                id: 5,
                title: "Математика",
                color: "#e6056e",
                dark_theme_color: "#ff4da0",
              },
            ],
            problem_sections: [
              {
                id: 81,
                title: "Механика",
                icon_src: "MechanicSectionIcon.svg",
                tile_color: "#0a64f5",
                dark_theme_tile_color: "#3d99ff",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 42,
                title: "Сопромат",
                icon_src: "MaterialResistanceIcon.svg",
                tile_color: "#0424f7",
                dark_theme_tile_color: "#5e7bff",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 93,
                title: "Геометрия",
                icon_src: "GeometrySectionIcon.svg",
                tile_color: "#f200f2",
                dark_theme_tile_color: "#f94cff",
                section_science: 5,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
        ],
        rejected: [
          {
            id: 770,
            global_number: 10,
            year: 2025,
            problem_translations: [
              {
                id: 773,
                problem_name: "Ячейки Бенара",
                problem_text:
                  "Равномерно и слегка нагрейте дно емкости, содержащей суспензию порошка в масле (например, слюдяную пудру в силиконовом масле). В результате могут возникать ячеистые структуры. Объясните и исследуйте это явление.",
                problem_by: "Задания XLVII Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 60,
                title: "Гидродинамика",
                icon_src: "HydrodynamicsIcon.svg",
                tile_color: "#119fe2",
                dark_theme_tile_color: "#00c8f2",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 56,
                title: "Термодинамика",
                icon_src: "TermometrSectionIcon.svg",
                tile_color: "#0109f5",
                dark_theme_tile_color: "#646eff",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
          {
            id: 77,
            global_number: 17,
            year: 2025,
            problem_translations: [
              {
                id: 77,
                problem_name: "Шестое чувство",
                problem_text:
                  "Органы чувств некоторых животных могут позволить им обнаруживать раздражители, недоступные человеческому восприятию. Предложите задание, требующее изучения чувствительности определённого рецептора у выбранных вами животных.",
                problem_by: "Задания XIII Всероссийского ТЮЕ",
              },
            ],
            sciences: [
              {
                id: 2,
                title: "Биология",
                color: "#00c41a",
                dark_theme_color: "#4bf84b",
              },
            ],
            problem_sections: [
              {
                id: 45,
                title: "Зоология",
                icon_src: "ZoologyIcon.svg",
                tile_color: "#0fb300",
                dark_theme_tile_color: "#6ad161",
                section_science: 2,
                tournament_type: 2,
              },
              {
                id: 68,
                title: "Человеческое тело",
                icon_src: "HumanBody.svg",
                tile_color: "#00b34a",
                dark_theme_tile_color: "#61d190",
                section_science: 2,
                tournament_type: 2,
              },
            ],
            materials: [],
            tournament_type: 2,
          },
          {
            id: 772,
            global_number: 12,
            year: 2025,
            problem_translations: [
              {
                id: 775,
                problem_name: "Звук против пламени",
                problem_text:
                  "Небольшое пламя можно погасить с помощью звука. Исследуйте параметры пламени и характеристики звука, определяющие, погаснет ли пламя.",
                problem_by: "Задания XLVII Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 59,
                title: "Акустика",
                icon_src: "AcusticSection.svg",
                tile_color: "#14b2d2",
                dark_theme_tile_color: "#00c0c0",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 38,
                title: "Аэродинамика",
                icon_src: "AeroDynamicsIcon.svg",
                tile_color: "#13add8",
                dark_theme_tile_color: "#00c5d2",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
        ],
        opposed: [
          {
            id: 750,
            global_number: 7,
            year: 2024,
            problem_translations: [
              {
                id: 753,
                problem_name: "Большая звучащая пластина",
                problem_text:
                  "Если изгибать большую тонкую гибкую пластину (например, из пластика, металла или оргстекла), она может издавать громкий и необычный воющий звук. Объясните и исследуйте это явление.",
                problem_by: "Задания XLVI Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 59,
                title: "Акустика",
                icon_src: "AcusticSection.svg",
                tile_color: "#14b2d2",
                dark_theme_tile_color: "#00c0c0",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 42,
                title: "Сопромат",
                icon_src: "MaterialResistanceIcon.svg",
                tile_color: "#0424f7",
                dark_theme_tile_color: "#5e7bff",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
          {
            id: 751,
            global_number: 8,
            year: 2024,
            problem_translations: [
              {
                id: 754,
                problem_name: "Ещё о магнитной левитации",
                problem_text:
                  "Поместите большой дисковый магнит на немагнитную проводящую пластину. Если двигать под пластиной магнит меньшего размера, то верхний магнит может при определённых условиях левитировать. Исследуйте эту левитацию и возможное движение верхнего магнита.",
                problem_by: "Задания XLVI Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
            ],
            problem_sections: [
              {
                id: 50,
                title: "Кинематика",
                icon_src: "KinematicsIcon.svg",
                tile_color: "#0f8fea",
                dark_theme_tile_color: "#10b9ff",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 67,
                title: "Магнетизм",
                icon_src: "MagneticSection.svg",
                tile_color: "#0b70f3",
                dark_theme_tile_color: "#33a0ff",
                section_science: 1,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
          {
            id: 752,
            global_number: 9,
            year: 2024,
            problem_translations: [
              {
                id: 755,
                problem_name: "Сочная батарея",
                problem_text:
                  "Солнечный фотоэлемент можно изготовить, используя электропроводящие стеклянные пластины, йод, сок (например, ежевичный) и диоксид титана. Такой фотоэлемент называется ячейка Гретцеля. Сделайте эту ячейку и исследуйте необходимые параметры для достижения её максимальной эффективности.",
                problem_by: "Задания XLVI Всероссийского ТЮФа",
              },
            ],
            sciences: [
              {
                id: 1,
                title: "Физика",
                color: "#0011ff",
                dark_theme_color: "#3f92ff",
              },
              {
                id: 3,
                title: "Химия",
                color: "#ff0000",
                dark_theme_color: "#ff3b3b",
              },
            ],
            problem_sections: [
              {
                id: 56,
                title: "Термодинамика",
                icon_src: "TermometrSectionIcon.svg",
                tile_color: "#0109f5",
                dark_theme_tile_color: "#646eff",
                section_science: 1,
                tournament_type: 1,
              },
              {
                id: 75,
                title: "Неорганическая химия",
                icon_src: "ChemistrySection.svg",
                tile_color: "#f20028",
                dark_theme_tile_color: "#ff3355",
                section_science: 3,
                tournament_type: 1,
              },
              {
                id: 74,
                title: "Органическая химия",
                icon_src: "OrganicChimestryIcon.svg",
                tile_color: "#f21400",
                dark_theme_tile_color: "#ff4433",
                section_science: 3,
                tournament_type: 1,
              },
            ],
            materials: [],
            tournament_type: 1,
          },
        ],
        players: [
          {
            id: 113,
            first_name: "А",
            second_name: "Ковалев",
            third_name: "А",
            fights: [],
          },
          {
            id: 114,
            first_name: "М",
            second_name: "Бисюков",
            third_name: "Д",
            fights: [],
          },
          {
            id: 115,
            first_name: "В",
            second_name: "Малышев",
            third_name: "А",
            fights: [],
          },
          {
            id: 116,
            first_name: "В",
            second_name: "Торунцов",
            third_name: "А",
            fights: [
              {
                fight_id: 128,
                fight_container_title: "1 бой",
                role: "REVIEWER",
              },
              {
                fight_id: 128,
                fight_container_title: "1 бой",
                role: "REPORTER",
              },
              {
                fight_id: 129,
                fight_container_title: "3 бой",
                role: "OPPONENT",
              },
            ],
          },
          {
            id: 117,
            first_name: "П",
            second_name: "Шумилов",
            third_name: "А",
            fights: [
              {
                fight_id: 129,
                fight_container_title: "3 бой",
                role: "REVIEWER",
              },
            ],
          },
        ],
      },
      {
        team: {
          id: 2,
          name: "Бобры",
          global_team_id: 2,
          players: [
            {
              id: 127,
              firstName: "М",
              secondName: "Геккель",
              thirdName: "С",
            },
            {
              id: 128,
              firstName: "А",
              secondName: "Скворцов",
              thirdName: "С",
            },
            {
              id: 129,
              firstName: "А",
              secondName: "Литвинова",
              thirdName: "А",
            },
            {
              id: 130,
              firstName: "К",
              secondName: "Прушинский",
              thirdName: "В",
            },
            {
              id: 131,
              firstName: "С",
              secondName: "Захаров",
              thirdName: "П",
            },
            {
              id: 132,
              firstName: "П",
              secondName: "Трофимов",
              thirdName: "А",
            },
            {
              id: 133,
              firstName: "М",
              secondName: "Нетбайло",
              thirdName: "Е",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 127,
            first_name: "М",
            second_name: "Геккель",
            third_name: "С",
            fights: [],
          },
          {
            id: 128,
            first_name: "А",
            second_name: "Скворцов",
            third_name: "С",
            fights: [],
          },
          {
            id: 129,
            first_name: "А",
            second_name: "Литвинова",
            third_name: "А",
            fights: [],
          },
          {
            id: 130,
            first_name: "К",
            second_name: "Прушинский",
            third_name: "В",
            fights: [],
          },
          {
            id: 131,
            first_name: "С",
            second_name: "Захаров",
            third_name: "П",
            fights: [],
          },
          {
            id: 132,
            first_name: "П",
            second_name: "Трофимов",
            third_name: "А",
            fights: [],
          },
          {
            id: 133,
            first_name: "М",
            second_name: "Нетбайло",
            third_name: "Е",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 8,
          name: "Беларусь Лбубубу",
          global_team_id: 8,
          players: [
            {
              id: 119,
              firstName: "М",
              secondName: "Захаров",
              thirdName: "В",
            },
            {
              id: 120,
              firstName: "С",
              secondName: "Шикло",
              thirdName: "С",
            },
            {
              id: 121,
              firstName: "И",
              secondName: "Журова",
              thirdName: "С",
            },
            {
              id: 122,
              firstName: "Д",
              secondName: "Иодко",
              thirdName: "В",
            },
            {
              id: 123,
              firstName: "Р",
              secondName: "Гузеев",
              thirdName: "А",
            },
            {
              id: 124,
              firstName: "А",
              secondName: "Кулич",
              thirdName: "П",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 119,
            first_name: "М",
            second_name: "Захаров",
            third_name: "В",
            fights: [],
          },
          {
            id: 120,
            first_name: "С",
            second_name: "Шикло",
            third_name: "С",
            fights: [],
          },
          {
            id: 121,
            first_name: "И",
            second_name: "Журова",
            third_name: "С",
            fights: [],
          },
          {
            id: 122,
            first_name: "Д",
            second_name: "Иодко",
            third_name: "В",
            fights: [],
          },
          {
            id: 123,
            first_name: "Р",
            second_name: "Гузеев",
            third_name: "А",
            fights: [],
          },
          {
            id: 124,
            first_name: "А",
            second_name: "Кулич",
            third_name: "П",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 7,
          name: "Случайные люди",
          global_team_id: 7,
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 74,
            first_name: "Unknown",
            second_name: "Unknown",
            third_name: "Unknown",
            fights: [],
          },
          {
            id: 76,
            first_name: "Unknown",
            second_name: "Unknown",
            third_name: "Unknown",
            fights: [],
          },
          {
            id: 79,
            first_name: "Unknown",
            second_name: "Unknown",
            third_name: "Unknown",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 5,
          name: "Могло быть хуже",
          global_team_id: 5,
          players: [
            {
              id: 81,
              firstName: "С",
              secondName: "Трегубова",
              thirdName: "Д",
            },
            {
              id: 82,
              firstName: "В",
              secondName: "Музоваткина",
              thirdName: "С",
            },
            {
              id: 83,
              firstName: "А",
              secondName: "Макарова",
              thirdName: "Д",
            },
            {
              id: 86,
              firstName: "М",
              secondName: "Бутырин",
              thirdName: "П",
            },
            {
              id: 87,
              firstName: "В",
              secondName: "Волков",
              thirdName: "В",
            },
            {
              id: 88,
              firstName: "Э",
              secondName: "Бикташева",
              thirdName: "М",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 81,
            first_name: "С",
            second_name: "Трегубова",
            third_name: "Д",
            fights: [],
          },
          {
            id: 82,
            first_name: "В",
            second_name: "Музоваткина",
            third_name: "С",
            fights: [],
          },
          {
            id: 83,
            first_name: "А",
            second_name: "Макарова",
            third_name: "Д",
            fights: [],
          },
          {
            id: 86,
            first_name: "М",
            second_name: "Бутырин",
            third_name: "П",
            fights: [],
          },
          {
            id: 87,
            first_name: "В",
            second_name: "Волков",
            third_name: "В",
            fights: [],
          },
          {
            id: 88,
            first_name: "Э",
            second_name: "Бикташева",
            third_name: "М",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 6,
          name: "FastyTasty",
          global_team_id: 6,
          players: [
            {
              id: 90,
              firstName: "Е",
              secondName: "Виноградов",
              thirdName: "",
            },
            {
              id: 91,
              firstName: "М",
              secondName: "Погребняк",
              thirdName: "",
            },
            {
              id: 92,
              firstName: "С",
              secondName: "Аборнева",
              thirdName: "",
            },
            {
              id: 93,
              firstName: "С",
              secondName: "Бобкова",
              thirdName: "",
            },
            {
              id: 94,
              firstName: "А",
              secondName: "Кудрявцев",
              thirdName: "",
            },
            {
              id: 129,
              firstName: "М",
              secondName: "Шубин",
              thirdName: "",
            },
            {
              id: 96,
              firstName: "К",
              secondName: "Зикирин",
              thirdName: "",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 90,
            first_name: "Е",
            second_name: "Виноградов",
            third_name: "",
            fights: [],
          },
          {
            id: 91,
            first_name: "М",
            second_name: "Погребняк",
            third_name: "",
            fights: [],
          },
          {
            id: 92,
            first_name: "С",
            second_name: "Аборнева",
            third_name: "",
            fights: [],
          },
          {
            id: 93,
            first_name: "С",
            second_name: "Бобкова",
            third_name: "",
            fights: [],
          },
          {
            id: 94,
            first_name: "А",
            second_name: "Кудрявцев",
            third_name: "",
            fights: [],
          },
          {
            id: 129,
            first_name: "М",
            second_name: "Шубин",
            third_name: "",
            fights: [],
          },
          {
            id: 96,
            first_name: "К",
            second_name: "Зикирин",
            third_name: "",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 1,
          name: "ФизиКон",
          global_team_id: 1,
          players: [
            {
              id: 108,
              firstName: "М",
              secondName: "Фетисов",
              thirdName: "Д",
            },
            {
              id: 109,
              firstName: "С",
              secondName: "Вешторт",
              thirdName: "В",
            },
            {
              id: 110,
              firstName: "Д",
              secondName: "Деркач",
              thirdName: "О",
            },
            {
              id: 111,
              firstName: "А",
              secondName: "Шмаков",
              thirdName: "М",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 108,
            first_name: "М",
            second_name: "Фетисов",
            third_name: "Д",
            fights: [],
          },
          {
            id: 109,
            first_name: "С",
            second_name: "Вешторт",
            third_name: "В",
            fights: [],
          },
          {
            id: 110,
            first_name: "Д",
            second_name: "Деркач",
            third_name: "О",
            fights: [],
          },
          {
            id: 111,
            first_name: "А",
            second_name: "Шмаков",
            third_name: "М",
            fights: [],
          },
        ],
      },
      {
        team: {
          id: 3,
          name: "ДИО-ГЕН",
          global_team_id: 3,
          players: [
            {
              id: 100,
              firstName: "С",
              secondName: "Андрюшкевич",
              thirdName: "С",
            },
            {
              id: 101,
              firstName: "С",
              secondName: "Алхимова",
              thirdName: "М",
            },
            {
              id: 102,
              firstName: "К",
              secondName: "Лисина",
              thirdName: "А",
            },
            {
              id: 103,
              firstName: "Г",
              secondName: "Унжаков",
              thirdName: "Р",
            },
            {
              id: 104,
              firstName: "А",
              secondName: "Мынкин",
              thirdName: "Д",
            },
            {
              id: 105,
              firstName: "Т",
              secondName: "Вышегородцева",
              thirdName: "С",
            },
          ],
        },
        reported: [],
        rejected: [],
        opposed: [],
        players: [
          {
            id: 100,
            first_name: "С",
            second_name: "Андрюшкевич",
            third_name: "С",
            fights: [],
          },
          {
            id: 101,
            first_name: "С",
            second_name: "Алхимова",
            third_name: "М",
            fights: [],
          },
          {
            id: 102,
            first_name: "К",
            second_name: "Лисина",
            third_name: "А",
            fights: [],
          },
          {
            id: 103,
            first_name: "Г",
            second_name: "Унжаков",
            third_name: "Р",
            fights: [],
          },
          {
            id: 104,
            first_name: "А",
            second_name: "Мынкин",
            third_name: "Д",
            fights: [],
          },
          {
            id: 105,
            first_name: "Т",
            second_name: "Вышегородцева",
            third_name: "С",
            fights: [],
          },
        ],
      },
    ],
  }
  return <TeamLogsList logs={data} fightsList={fights} />
}
