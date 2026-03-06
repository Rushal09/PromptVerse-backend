import User from "../models/user.model.js";
import Credit from "../models/credit.model.js";
import Prompt from "../models/promt.model.js";
//Function to Create New Credit
//only admin can create credit and give to other users

export const createCredit = async (req, res) => {
  const { userId, amount, transactionType, description } = req.body;
  const { currentUserId } = req.user && req.user._id;

  if (req.user.userType !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    if (!userId || !amount || !transactionType || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (transactionType !== "credit" && transactionType !== "debit") {
      return res.status(400).json({
        message: "Transaction type must be either 'credit' or 'debit'",
      });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }
    if (transactionType === "debit" && user.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for debit" });
    }

    user.balance += transactionType === "credit" ? amount : -amount;
    await user.save();

    const credit = new Credit({
      userId,
      amount,
      transactionType,
      description,
    });
    await credit.save();
    return res.status(201).json({
      message: "Credit created successfully",
      credit,
      userBalance: user.balance,
    });
  } catch (error) {
    console.error("Error creating credit:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Auto adding the credit for the user who have add prompt and that propmt get more then 500 likes then they will get revenue

export const autoCreditForPopularPrompts = async (prompt) => {
  try {
    const { userId } = prompt.createdBy;
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for auto credit:", userId);
      return;
    }
    const creditAmount = 10; // Define the amount to credit for popular prompts
    user.balance += creditAmount;
    await user.save();
    const credit = new Credit({
      userId: user._id,
      amount: creditAmount,
      transactionType: "credit",
      description: "Auto credit for popular prompt",
    });
    await credit.save();
    console.log(`Auto credit of ${creditAmount} added for user ${userId}`);
  } catch (error) {
    console.error("Error in auto credit for popular prompts:", error);
  }
};

//the function that check the likes on the prompt and if it is more than 500 then it will call the autoCreditForPopularPrompts function and it will call again when the like we be 1000 and same for until infinity
export const checkAndCreditPopularPrompts = async (prompt) => {
  try {
    if (prompt.likes >= 500) {
      await autoCreditForPopularPrompts(prompt);
    }
  } catch (error) {
    console.error("Error checking and crediting popular prompts:", error);
  }
};

//function to check and credit popular prompts
export const checkAndCreditPopularPromptsRoute = async (req, res) => {
  const { promptId } = req.params;
  try {
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    await checkAndCreditPopularPrompts(prompt);
    return res
      .status(200)
      .json({ message: "Check and credit process completed" });
  } catch (error) {
    console.error("Error in check and credit route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get the credit history of the user
export const getCreditHistory = async (req, res) => {
  const userId = req.user && req.user._id;
  try {
    const credits = await Credit.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(credits);
  } catch (error) {
    console.error("Error fetching credit history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get the balance of the user
export const getUserBalance = async (req, res) => {
  const userId = req.user && req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
