import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const SquareCard = ({
    title,
    link,
    children,
  }: {
    title: string;
    link: string;
    children: React.ReactNode;
  }) => (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );

  const WideCard = ({
    title,
    link,
    children,
  }: {
    title: string;
    link: string;
    children: React.ReactNode;
  }) => (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 w-full"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );

  return (
    <div className="w-full h-full p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Top row: 2 square cards filling the row equally */}
        <div className="flex justify-between gap-4 max-w-full">
          <div className="flex-1">
            <SquareCard title="User Profile" link="/settings">
              <p>
                <strong>Name:</strong> John Doe
              </p>
              <p>
                <strong>Email:</strong> johndoe@example.com
              </p>
            </SquareCard>
          </div>

          <div className="flex-1">
            <SquareCard title="Friends" link="/friends">
              <ul>
                <li>Alice Johnson</li>
                <li>Bob Smith</li>
                <li>Charlie Brown</li>
              </ul>
            </SquareCard>
          </div>
        </div>

        {/* Bottom full-width rectangular bars */}
        <div className="space-y-6">
          <WideCard title="Calendar" link="/calendar">
            <p>Upcoming: Math HW due April 25 at 11:59 PM</p>
          </WideCard>

          <WideCard title="Tasks" link="/tasks">
            <ul className="list-disc list-inside">
              <li>Math HW - April 25</li>
              <li>Science Presentation - April 28</li>
              <li>History Essay - May 2</li>
            </ul>
          </WideCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;