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
      className="cursor-pointer bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
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
      className="cursor-pointer bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300 w-full"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
  );

  return (
    <div className="w-full h-full p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Top row: 2 square cards side-by-side filling full width */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <SquareCard title="User Profile" link="/settings">
            <p>
              <strong>Name:</strong> John Doe
            </p>
            <p>
              <strong>Email:</strong> johndoe@example.com
            </p>
          </SquareCard>

          <SquareCard title="Friends" link="/friends">
            <ul className="list-disc list-inside">
              <li>Alice Johnson</li>
              <li>Bob Smith</li>
              <li>Charlie Brown</li>
            </ul>
          </SquareCard>
        </div>

        {/* Bottom full-width rectangular cards */}
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
  );
};

export default Dashboard;
